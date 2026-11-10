import { useEffect, useRef, useState } from 'react'
import {
  Scene, WebGLRenderer, PerspectiveCamera, Color, Group, Box3, Vector3,
  Mesh, ExtrudeGeometry, MeshStandardMaterial,
  InstancedMesh, BoxGeometry, Object3D,
  AmbientLight, DirectionalLight,
  ShaderMaterial, SphereGeometry, BackSide,
} from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { animate, createTimeline, createTimer, stagger, utils, cubicBezier, linear } from 'animejs'
import { getInstances } from 'animejs/adapters/three'
import logoSvg from './rishabh-logo.svg?raw'
import './Loader.css'

/**
 * Portfolio preloader — port of the "Anime.js 3D logo animation" demo
 * by @coding.stella (a Three.js + anime.js recreation of the anime.js
 * logo intro), sent by Rishabh as a zip
 * (workspace/user/files/Anime.js-3D-logo-animation.zip).
 *
 * What changed from the demo (everything else is 1:1):
 *  - the logo reads "Rishabh" instead of "anime.js 3D": the letters
 *    are SVG paths, not text, so the word was redrawn from Inter
 *    ExtraBold (the portfolio's own body font) into the same
 *    coordinate space — see rishabh-logo.svg + the generator in
 *    ~/workspace/tmp-work/fontgen/gen-rishabh-logo.js. The demo's
 *    ".js" and "3D" are gone entirely (Rishabh's order 2026-11-10).
 *  - the two geometry-tuned constants are re-derived from the new
 *    word at runtime: the cube sweep (was 16.4 — the cube starts over
 *    the i and sweeps toward the end of the word) and the logo
 *    recenter (was 8.7 — the shift that centers the word on the
 *    camera axis, since the word extends further right of the i
 *    than left of it).
 *  - the demo loops forever; the loader plays ONCE (~13.5s) and then
 *    fades out and calls onDone. Click (or Enter/Escape) skips it.
 *  - prefers-reduced-motion and a failed WebGL init skip the loader
 *    immediately — the visitor must never be trapped on a loader.
 *  - the demo appends its canvas to document.body; here it goes into
 *    the loader's own root, and everything is torn down on unmount.
 *
 * The hero entrance is gated on this loader: App passes introReady
 * once the loader lifts, so the hero animates in as the reveal.
 */

const LETTER_IDS = ['R', 'i-bar', 's1', 'h1', 'a', 'b', 'h2']
const DEPTH = 0.2565
const ITALIC_SKEW = 8

export default function Loader({ onDone }) {
  const rootRef = useRef(null)
  const [fading, setFading] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone()
      return undefined
    }
    let cancelled = false
    let player = null
    let renderTimer = null
    let renderer = null
    let onResize = null

    const dismiss = () => {
      if (doneRef.current) return
      doneRef.current = true
      setFading(true)
      window.setTimeout(() => {
        if (!cancelled) onDone()
      }, 650)
    }

    try {
      // Parse the SVG logo into centered, extruded 3D geometries
      const data = new SVGLoader().parse(logoSvg)

      const parsed = {}
      function flipShapeY(shape) {
        const flipPath = (p) => p.curves.forEach((c) => {
          if (c.v0) c.v0.y = -c.v0.y
          if (c.v1) c.v1.y = -c.v1.y
          if (c.v2) c.v2.y = -c.v2.y
          if (c.v3) c.v3.y = -c.v3.y
        })
        flipPath(shape)
        shape.holes.forEach(flipPath)
      }

      for (const path of data.paths) {
        const id = path.userData?.node?.id
        if (!id) continue
        const shapes = SVGLoader.createShapes(path)
        shapes.forEach(flipShapeY)
        const geom = new ExtrudeGeometry(shapes, { depth: DEPTH, bevelEnabled: false })
        const bbox = new Box3().setFromBufferAttribute(geom.attributes.position)
        const center = bbox.getCenter(new Vector3())
        const size = bbox.getSize(new Vector3())
        geom.translate(-center.x, -center.y, -center.z)
        parsed[id] = { geom, center, size, color: path.userData.style.fill || '#fff' }
      }

      // Align dot with the letter i so the dot sits directly above the i.
      parsed['i-dot'].center.x = parsed['i-bar'].center.x

      const meshes = {}
      const logoGroup = new Group()
      for (const id of [...LETTER_IDS, 'i-dot']) {
        const { geom, center, size, color } = parsed[id]
        const mesh = new Mesh(geom, new MeshStandardMaterial({
          color: new Color(color), roughness: 0.4, metalness: 0.1,
        }))
        mesh.position.copy(center)
        mesh.userData.halfHeight = size.y / 2
        meshes[id] = mesh
        logoGroup.add(mesh)
      }

      const FLOOR_COLS = 31
      const FLOOR_ROWS = 31
      const tileSize = 1

      const scale = tileSize / parsed['i-dot'].size.x
      logoGroup.scale.setScalar(scale)
      const iLocalBottomY = parsed['i-bar'].center.y - parsed['i-bar'].size.y / 2
      logoGroup.position.set(
        -parsed['i-dot'].center.x * scale,
        tileSize / 2 - iLocalBottomY * scale,
        0,
      )

      const wrapper = new Group()
      wrapper.add(logoGroup)
      // Land the logo pop at the floor instead of 5 above, the intro is untouched since the logo is hidden until POP.
      wrapper.position.y = -5

      // Geometry-derived constants for the "Rishabh" word.
      // Cube sweep: in the original the cube ends at 16.4 world units,
      // which is 78.5% of the distance from the i-dot to the lockup's
      // right edge (the "d" of the "3D" block) — the cube sweeps past
      // the word toward the block. With the block gone, the lockup's
      // right edge is the last letter ("h2"), so the same 78.5% of
      // the i-dot -> "h2" distance lands the cube just right of the
      // word's middle, on-frame. Deriving it from the lockup keeps the
      // cube on-frame for any word length; scaling by the word span
      // instead overshoots (33.5 here) and the cube flies off-screen.
      const rightOf = (id) => parsed[id].center.x + parsed[id].size.x / 2
      const leftOf = (id) => parsed[id].center.x - parsed[id].size.x / 2
      const lockupRightWorld = (rightOf('h2') - parsed['i-dot'].center.x) * scale
      const sweepX = 0.785 * lockupRightWorld
      // Recenter: the logo group starts with the i-dot on the camera
      // axis (x=0), but the word extends further right of the i than
      // left of it, so the word's center sits right of the axis. Slide
      // the group left by that offset so the word is centered on the
      // end card. (The original's 8.7 did the same for "anime.js 3D".)
      const recenterShift =
        (((leftOf('R') + rightOf('h2')) / 2) - parsed['i-dot'].center.x) * scale

      const SCENE_GREY = '#b5b5ba'
      const HORIZON_GREY = '#cfcfd4'
      const SKY_GREY = '#8e8e96'
      const BG = '#252423'

      // Scene and gradient sky dome
      const scene = new Scene()
      scene.background = new Color(BG)

      // Vertical gradient skydome, colors and horizon position driven by uniforms so they stay editable.
      const skyMaterial = new ShaderMaterial({
        uniforms: {
          topColor: { value: new Color(SKY_GREY) },
          bottomColor: { value: new Color(HORIZON_GREY) },
          offset: { value: 32 },
          exponent: { value: 0.6 },
        },
        side: BackSide,
        fog: false,
        vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
        fragmentShader: `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    varying vec3 vWorldPosition;
    void main() {
      float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
      gl_FragColor = vec4(mix(bottomColor, topColor, pow(max(h, 0.0), exponent)), 1.0);
      #include <colorspace_fragment>
    }
  `,
      })
      const sky = new Mesh(new SphereGeometry(600, 32, 15), skyMaterial)
      scene.add(sky)
      scene.add(wrapper)

      // Floor: instanced tile grid with solid skirts
      const floorGroup = new Group()
      const floor = new InstancedMesh(
        new BoxGeometry(tileSize, tileSize, tileSize),
        new MeshStandardMaterial({ color: new Color(SCENE_GREY), roughness: 0.7, metalness: 0.05 }),
        FLOOR_COLS * FLOOR_ROWS,
      )
      const dummy = new Object3D()
      for (let r = 0; r < FLOOR_ROWS; r++) {
        for (let c = 0; c < FLOOR_COLS; c++) {
          dummy.position.set(c - (FLOOR_COLS - 1) / 2, 0, r - (FLOOR_ROWS - 1) / 2)
          dummy.updateMatrix()
          floor.setMatrixAt(r * FLOOR_COLS + c, dummy.matrix)
        }
      }
      floorGroup.add(floor)

      const tiles = getInstances(floor)

      // Extend the floor on all four sides with solid skirts, centered on the origin like the tile grid, so the edges never show.
      const FLOOR_HALF_X = FLOOR_COLS * tileSize / 2
      const FLOOR_HALF_Z = FLOOR_ROWS * tileSize / 2
      const SKIRT_EXT = 5
      const skirts = []
      const addSkirt = (width, depth, x, z) => {
        const skirt = new Mesh(new BoxGeometry(width, tileSize, depth), floor.material)
        skirt.position.set(x, 0, z)
        floorGroup.add(skirt)
        skirts.push(skirt)
      }
      addSkirt(SKIRT_EXT, 2 * FLOOR_HALF_Z, FLOOR_HALF_X + SKIRT_EXT / 2, 0)
      addSkirt(SKIRT_EXT, 2 * FLOOR_HALF_Z, -FLOOR_HALF_X - SKIRT_EXT / 2, 0)
      addSkirt(2 * FLOOR_HALF_X + 2 * SKIRT_EXT, SKIRT_EXT, 0, FLOOR_HALF_Z + SKIRT_EXT / 2)
      addSkirt(2 * FLOOR_HALF_X + 2 * SKIRT_EXT, SKIRT_EXT, 0, -FLOOR_HALF_Z - SKIRT_EXT / 2)
      scene.add(floorGroup)

      const cube = new Mesh(
        new BoxGeometry(tileSize, tileSize, tileSize),
        new MeshStandardMaterial({ color: '#FF4B4B', roughness: 0.4, metalness: 0.1 }),
      )
      scene.add(cube)

      // Lights, camera and renderer
      const ambient = new AmbientLight(0xffffff, 0.6)
      scene.add(ambient)
      const keyLight = new DirectionalLight(0xffffff, 1.6)
      keyLight.position.set(100, 200, 300)
      scene.add(keyLight)
      const rimLight = new DirectionalLight(0xaab8ff, 0.6)
      rimLight.position.set(-200, -50, 150)
      scene.add(rimLight)

      const camera = new PerspectiveCamera(35, innerWidth / innerHeight, 0.01, 100)
      const cameraRig = new Group()
      cameraRig.add(camera)
      scene.add(cameraRig)

      renderer = new WebGLRenderer({ antialias: true })
      renderer.setSize(innerWidth, innerHeight)
      renderer.setPixelRatio(devicePixelRatio || 1)
      rootRef.current.appendChild(renderer.domElement)
      renderer.domElement.style.opacity = '0'

      onResize = () => {
        const aspect = innerWidth / innerHeight
        camera.aspect = aspect
        camera.updateProjectionMatrix()
        renderer.setSize(innerWidth, innerHeight)
        updateFit()
      }
      addEventListener('resize', onResize)

      // Initial pose for every animated target
      const letters = LETTER_IDS.map((id) => meshes[id])
      const dot = meshes['i-dot']
      const bottomOrigin = (m) => `0 ${-m.userData.halfHeight} 0`

      const dotRestX = dot.position.x

      letters.forEach((m) => utils.set(m, {
        skewX: -ITALIC_SKEW,
        transformOrigin: bottomOrigin(m),
      }))

      utils.set(dot, {
        x: dotRestX - 0.045,
        y: 15,
        scaleY: 0,
        transformOrigin: bottomOrigin(dot),
      })

      utils.set(camera, {
        x: 0,
        y: 5.64,
        z: 20.66,
        rotateX: -14.73,
        fov: 60,
        zoom: 1,
        near: 1,
        // Far plane must clear the farthest dolly distance: on narrow
        // screens the fit factor pulls the camera back (end of the
        // flatten: FLATTEN_DIST_NUM * 1.5 * fit / tan(1 deg), ~2960 at
        // fit 2.89) plus the 600-radius sky dome behind the logo. The
        // demo's 2000 was tuned for desktop (fit 1, ~1025) and would
        // clip the whole scene on a portrait phone.
        far: 6000,
      })

      const DEG2RAD = Math.PI / 180
      // Hold the logo framing while the flatten narrows the fov, derive the dolly distance from fov each frame.
      const FLATTEN_BASE_FOV = camera.fov
      const FLATTEN_DIST_NUM = camera.position.z * Math.tan(FLATTEN_BASE_FOV * 0.5 * DEG2RAD)
      const flattenDezoom = { value: 1 }

      // Narrow screens: the camera's horizontal field of view shrinks
      // with the aspect, so the wide lockup would crop on portrait
      // phones (the demo was built for a desktop viewport). Pull the
      // dolly back by a fit factor so the whole lockup fits. The fit
      // must use the framing at the moment the logo first appears
      // (POP: dezoom 1, zoom 1) — not the end state (dezoom 1.5) —
      // because the letters are fully on screen for ~1.5s before the
      // dezoom/flatten finish; fitting for the end state still left
      // the "r" and the "D" cropped on a 390px phone. Visible
      // half-width at the logo plane is FLATTEN_DIST_NUM * aspect at
      // that moment (the render loop holds framing as fov changes, so
      // fov drops out). Desktop aspects already fit, so the factor is
      // 1 there and the animation is untouched.
      const lockupHalfWorld = ((rightOf('h2') - leftOf('R')) / 2) * scale
      let fitFactor = 1
      const updateFit = () => {
        const aspect = innerWidth / innerHeight
        const popHalfW = FLATTEN_DIST_NUM * aspect
        fitFactor = Math.max(1, (lockupHalfWorld * 1.15) / popHalfW)
      }
      updateFit()

      utils.set(skyMaterial, {
        topColor: '#818198',
        bottomColor: '#b6b6b9',
        offset: -38,
        exponent: 1.15,
      })

      utils.set(ambient, {
        intensity: 0.6,
      })

      utils.set(keyLight, {
        intensity: 1.6,
        color: '#ffffff',
        x: 0,
        y: 30,
        z: 0,
      })

      utils.set(rimLight, {
        intensity: 0.6,
        color: '#aab8ff',
        x: -200,
        y: -50,
        z: 150,
      })

      utils.set(tiles, {
        x: stagger(1, { grid: true, from: 'center', axis: 'x' }),
        z: stagger(1, { grid: true, from: 'center', axis: 'z' }),
        y: 0,
      })

      utils.set(floor, {
        color: '#d4d4d8',
      })

      utils.set(cube, {
        x: 0,
        y: 0,
        z: 0,
        transformOriginY: -0.5,
      })

      utils.set(logoGroup, {
        y: -0.31,
        z: -0.5,
      })

      // Effect helpers: tile rings, seeded randoms, damped shake
      const centerTile = tiles[Math.floor(FLOOR_ROWS / 2) * FLOOR_COLS + Math.floor(FLOOR_COLS / 2)]

      // Center tiles within this radius explode at POP, tiles outside it stay as the remaining floor.
      const EXPLODE_RADIUS = 10
      const tileRingDistance = (i) => Math.hypot(
        (i % FLOOR_COLS) - Math.floor(FLOOR_COLS / 2),
        Math.floor(i / FLOOR_COLS) - Math.floor(FLOOR_ROWS / 2),
      )
      const getCenterTiles = (radius) => tiles.filter((tile, i) => tileRingDistance(i) <= radius)
      const getOuterTiles = (radius) => tiles.filter((tile, i) => tileRingDistance(i) > radius)

      // Seeded random generators, one per source so each advances on its own and stays reproducible.
      const explodeDurX = utils.createSeededRandom(4, 800, 1279)
      const explodeDurZ = utils.createSeededRandom(0, 800, 1279)
      const explodeDurY = utils.createSeededRandom(7, 800, 1279)
      const explodeRotX = utils.createSeededRandom(7, -1080, 1080)
      const explodeRotY = utils.createSeededRandom(13, -1080, 1080)
      const explodeRotZ = utils.createSeededRandom(21, -1080, 1080)
      const explodeScaleDur = utils.createSeededRandom(0, 500, 1200)
      const burstRotX = utils.createSeededRandom(10, -540, 540)
      const burstRotY = utils.createSeededRandom(7, -540, 540)
      const burstRotZ = utils.createSeededRandom(12, -540, 540)

      // Damped shake: drive a 0 -> 1 progress and map it to a decaying oscillation, replacing long
      // hand-authored skew keyframe arrays. amplitude relaxes from amp toward settle, frequency sweeps up.
      const shake = (amp, cycles, { decay = 1, sweep = 0, settle = 0, dir = 1, center = 0 } = {}) =>
        (t) => center + dir * (settle + (amp - settle) * (1 - t) ** decay) * Math.sin(cycles * (t + sweep * t * t) * 2 * Math.PI)

      // Run a shake only over the [start, 1] portion of the progress, for a delayed second hit.
      const lateShake = (amp, cycles, start, opts = {}) => {
        const inner = shake(amp, cycles, opts)
        return (t) => (t < start ? 0 : inner((t - start) / (1 - start)))
      }

      // Master timeline
      const tl = createTimeline({
        id: 'Rishabh logo',
        autoplay: false,
      })
        .add(renderer.domElement, {
          id: 'fade in',
          // Fade the canvas up from the page background so the intro starts out of flat dark.
          opacity: [0, 1],
          duration: 1300, ease: 'inOut(2)',
        }, 0)
        .add(camera, {
          id: 'camera follow',
          rotateX: [
            { to: 38, duration: 700, ease: 'inOut(2)' },
            { to: 41, duration: 500, delay: 0, ease: 'inOutSine' },
            { to: 40.5, duration: 200, delay: 0, ease: 'inOutSine' },
            { to: 36, duration: 180, delay: 0, ease: 'in(2)' },
            { to: 24, duration: 80, delay: 0, ease: 'in(2)' },
            { to: -10, duration: 40, delay: 0, ease: 'in(1.5)' },
            { to: -16.5, duration: 90, delay: 20, ease: 'out(2)' },
            { to: -14.73, duration: 190, delay: 0, ease: 'inOutSine' },
          ],
          y: [
            { to: 6.3, duration: 900, ease: 'inOut(2)' },
            { to: 6.4, duration: 500, delay: 0, ease: 'inOutSine' },
            { to: 6.15, duration: 180, delay: 0, ease: 'in(2)' },
            { to: 5.04, duration: 120, delay: 0, ease: 'in(2)' },
          ],
        }, 300)
        .add(cube, {
          id: 'cube enter',
          y: [
            { from: 24, to: 1, duration: 300, delay: 1700, ease: 'in(5.0825)' },
            { from: 0, to: 0.138, duration: 60, delay: 0, ease: cubicBezier(0, 1.1575, 0.5712, 0.9605) },
            { to: -0.75, duration: 1040, ease: cubicBezier(0, 1.1575, 0.5712, 0.9605) },
            { from: -1.75, to: -2.5, duration: 146, delay: 0, ease: 'out(9.8523)' },
          ],
          scaleX: [
            { from: 0, to: 1, duration: 2000, delay: 0 },
            { from: 1.3, to: 1, duration: 100, ease: 'out(2)' },
          ],
          scaleY: [
            { from: 5, to: 2, duration: 2000, delay: 0 },
            { to: 1.25, duration: 200, delay: 0, ease: cubicBezier(0.1, 0.7, 0.5763, 0.7728) },
            { to: 1, duration: 900, delay: 0, ease: cubicBezier(0.1, 0.7, 0.5763, 0.7728) },
          ],
          scaleZ: [
            { from: 0, to: 1, duration: 2000 },
            { from: 1.3, to: 1, duration: 100, ease: 'out(2)' },
          ],
          ease: 'in(2.4146)',
          skewX: { from: 0, to: 1, duration: 1143, delay: 2000, ease: 'linear', modifier: shake(8, 18, { decay: 2 }) },
          skewZ: { from: 0, to: 1, duration: 1143, delay: 2000, ease: 'linear', modifier: shake(8, 18, { decay: 2 }) },
        }, 0)
        .set(centerTile, { scale: 0 }, 2000)
        .add(tiles, {
          id: 'floor crash',
          y: [
            { from: 0, to: stagger([0.15, 0], { from: 'center', ease: linear('0', '0.185 70.69%', '0.4644 84.63%', '0.7852 95.62%', '1'), grid: true }), duration: 50, delay: stagger([0, 451], { from: 'center', ease: 'in(2.5507)', grid: true }), ease: cubicBezier(0.5621, 0.9568, 0.5, 1) },
            { to: stagger([-1.5, 0], { from: 'center', ease: linear('0', '0.2812 12.72%', '0.5478 20.84%', '1 41.29%', '1'), grid: true, jitter: [0.102, 0], seed: 0 }), duration: 1050, delay: 0, ease: cubicBezier(0, 0.8, 0, 1.0128) },
            { to: stagger([-3, 0], { from: 'center', ease: linear('0', '0 14.17%', '0.5317 25.26%', '0.8904 47.35%', '1 47.8%', '1'), grid: true, jitter: [0.3, 0], seed: 0 }), duration: stagger([0, 656], { from: 'center', ease: linear('0', '0.0368 14.54%', '0.3042 62.23%', '1 62.24%', '1'), grid: true, jitter: [50, 0], seed: 0 }), delay: 0, ease: cubicBezier(0, 1.0807, 0.3512, 1.2537) },
          ],
          rotateX: { to: stagger([0, 0], { from: 'center', ease: linear('0', '0 13.93%', '0.2419 40.77%', '1 55.03%', '1'), grid: true, jitter: [20, 0], seed: 6 }), duration: 1200, delay: 0 },
          rotateY: { to: stagger([0, 0], { from: 'center', ease: linear('0', '0 13.93%', '0.2419 40.77%', '1 55.03%', '1'), grid: true, jitter: [20, 0], seed: 12 }), duration: 1260, delay: 0 },
          rotateZ: { to: stagger([0, 0], { from: 'center', ease: linear('0', '0 13.93%', '0.2419 40.77%', '1 55.03%', '1'), grid: true, jitter: [20, 0], seed: 3 }), duration: 1200, delay: 50 },
        }, 2000)
        .add(camera, {
          id: 'camera shake',
          y: { from: 0, to: 1, duration: 1412, ease: 'linear', modifier: (t) => shake(0.12, 15, { decay: 2, center: 5.64 })(t) + lateShake(0.97, 2, 0.78, { decay: 1.6 })(t) },
          rotateZ: { from: 0, to: 1, duration: 1437, ease: 'linear', modifier: (t) => shake(0.42, 10, { decay: 1.8 })(t) + lateShake(0.42, 2, 0.79, { decay: 1.4 })(t) },
          ease: 'inOutSine',
        }, 2000)
        .add(cube, {
          id: 'cube recover',
          skewX: [
            { to: -9, duration: 58, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
            { to: 7, duration: 63, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
            { to: -5, duration: 71, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
            { to: 3.5, duration: 77, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
            { to: -2, duration: 82, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
            { to: 1, duration: 90, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
            { to: -0.5, duration: 96, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
            { to: 0, duration: 83, delay: 0, ease: cubicBezier(0.3815, 0.0684, 0.5, 1) },
          ],
          scaleY: [
            { to: 0.8, duration: 77, ease: 'out(3)' },
            { to: 1.12, duration: 102, delay: 0, ease: 'inOutSine' },
            { to: 0.94, duration: 109, delay: 0, ease: 'inOutSine' },
            { to: 1.05, duration: 115, delay: 0, ease: 'inOutSine' },
            { to: 0.98, duration: 109, delay: 0, ease: 'inOutSine' },
            { to: 0.97, duration: 108, delay: 0, ease: 'inOutSine' },
          ],
          scaleX: [
            { to: 1.15, duration: 77, ease: 'out(3)' },
            { to: 0.93, duration: 102, delay: 0, ease: 'inOutSine' },
            { to: 1.04, duration: 109, delay: 0, ease: 'inOutSine' },
            { to: 0.97, duration: 115, delay: 0, ease: 'inOutSine' },
            { to: 1.01, duration: 109, delay: 0, ease: 'inOutSine' },
            { to: 1.02, duration: 108, delay: 0, ease: 'inOutSine' },
          ],
          scaleZ: [
            { to: 1.15, duration: 77, ease: 'out(3)' },
            { to: 0.93, duration: 102, delay: 0, ease: 'inOutSine' },
            { to: 1.04, duration: 109, delay: 0, ease: 'inOutSine' },
            { to: 0.97, duration: 115, delay: 0, ease: 'inOutSine' },
            { to: 1.01, duration: 109, delay: 0, ease: 'inOutSine' },
            { to: 1.02, duration: 108, delay: 0, ease: 'inOutSine' },
          ],
          y: [
            { to: -2.56, duration: 77, ease: 'out(3)' },
            { to: -2.47, duration: 128, delay: 0, ease: 'inOutSine' },
            { to: -2.52, duration: 140, delay: 0, ease: 'inOutSine' },
            { to: -2.53, duration: 275, delay: 0, ease: 'inOutSine' },
          ],
        }, 3230)
        .add(cube, {
          id: 'cube expand',
          scaleY: { to: 4, duration: 4150, delay: 800, ease: cubicBezier(0.2423, -0.0053, 0.3107, 0.5533) },
          scaleX: { to: 0.8, duration: 4150, delay: 800, ease: cubicBezier(0.2423, -0.0053, 0.3107, 0.5533) },
          scaleZ: { to: 0.8, duration: 4150, delay: 800, ease: cubicBezier(0.2423, -0.0053, 0.3107, 0.5533) },
          y: { to: 0.75, duration: 4150, delay: 800, ease: cubicBezier(0.2423, -0.0053, 0.3107, 0.5533) },
          skewX: { from: 0, to: 1, duration: 4150, delay: 800, ease: 'linear', modifier: shake(9.5, 21, { decay: 1.5, sweep: 1.2, settle: 3.1 }) },
          skewZ: { from: 0, to: 1, duration: 4150, delay: 800, ease: 'linear', modifier: shake(4.3, 18, { decay: 0.7, sweep: 1.4, dir: -1 }) },
        }, 3050)
        .add(getCenterTiles(8), {
          id: 'floor expand',
          y: [
            { to: stagger([-3.5, -0.82], { from: 'center', ease: linear('0', '0.0878 0.01%', '0.3904 50.14%', '0.7766 68.95%', '1'), grid: true, jitter: [0.3, 0], seed: 0 }), duration: 260, delay: 0, ease: 'out(3)' },
            { to: stagger([1.4, -0.72], { from: 'center', ease: linear('0', '0 28.61%', '0.27 28.62%', '0.7766 68.95%', '1'), grid: true, jitter: [0.3, 0], seed: 0 }), duration: 4100, delay: 440, ease: cubicBezier(0.2423, -0.0053, 0.367, 0.5896) },
          ],
        }, 3200)
        .label('POP', 8000)
        .label('slowmo start', 'POP-=0')
        .label('slowmo end', 'POP+=500')
        .add(camera, {
          id: 'camera zoom in',
          zoom: { to: 2, duration: 5500, delay: 0, ease: cubicBezier(0.6985, 0.1061, 0.5527, 0.7364) },
        }, 2500)
        .add(cameraRig, {
          id: 'camera orbit',
          rotateY: [
            { from: -270, to: -180, duration: 3600, delay: 0 },
            { to: 0, duration: 700, delay: 1000, ease: cubicBezier(0.375, -0.0148, 0, 1.0101) },
          ],
          rotateX: { to: 0, duration: 1900, delay: 2700 },
          y: [
            { to: 0, duration: 1900, delay: 2700 },
            { to: 0, duration: 300, delay: 0, ease: 'out(2)' },
          ],
          ease: 'inOut(2)',
        }, 3400)
        .add(getCenterTiles(EXPLODE_RADIUS), {
          id: 'floor explode',
          x: { to: stagger([1, 40], { from: 'center', grid: true, axis: 'x', jitter: 5, seed: 0 }), duration: () => explodeDurX(), delay: stagger([0, 137], { from: 'center', grid: true }), ease: 'out(5.3605)' },
          z: { to: stagger([1, 40], { from: 'center', grid: true, axis: 'z' }), duration: () => explodeDurZ(), delay: stagger([0, 137], { from: 'center', grid: true, jitter: 5, seed: 0 }), ease: 'out(5.3605)' },
          y: { to: stagger([40, 1], { from: 'center', ease: cubicBezier(0.3326, 0.0289, 0.9886, 0.4057), grid: true, jitter: 5, seed: 0 }), duration: () => explodeDurY(), delay: stagger([0, 137], { from: 'center', grid: true }), ease: 'out(5.3605)' },
          rotateX: { to: () => explodeRotX(), duration: 815, delay: stagger([0, 314], { from: 'center', grid: true }), ease: 'out(2)' },
          rotateY: { to: () => explodeRotY(), duration: 815, delay: stagger([0, 314], { from: 'center', grid: true }), ease: 'out(2)' },
          rotateZ: { to: () => explodeRotZ(), duration: 815, delay: stagger([0, 314], { from: 'center', grid: true }), ease: 'out(2)' },
          scale: { to: 0, duration: () => explodeScaleDur(), delay: stagger([0, 314], { from: 'center', grid: true }), ease: 'out(2.8731)' },
          duration: 113,
          delay: stagger([0, 210], { from: 'center', grid: true, seed: 0 }),
          ease: 'linear',
        }, 'POP-=15')
        .add([...getOuterTiles(EXPLODE_RADIUS), ...skirts], {
          id: 'floor drop',
          // Sink the remaining floor tiles and skirts straight down out of view, the exploded center is left alone.
          y: { to: -50, duration: 604, delay: 146, ease: cubicBezier(0.8109, 0.0308, 0.9152, 0.5479) },
        }, 'POP-=150')
        .add(letters, {
          id: 'letters pop',
          // 2D POP letters bounce. translateY -> local y (2D value x -0.01118), scales and eases ported 1:1.
          y: [
            { from: -0.39, to: 3.23, duration: 240, ease: cubicBezier(0.225, 1, 0.915, 0.98) },
            { to: 1.9, duration: 120, delay: 20, ease: 'inQuad' },
            { to: 1.9, duration: 120, delay: 0, ease: 'outQuad' },
          ],
          scaleX: [
            { to: [0.25, 0.85], duration: 240, ease: 'outQuad' },
            { to: 1.08, duration: 120, delay: 85, ease: 'inOutSine' },
            { to: 1, duration: 260, delay: 25, ease: 'outQuad' },
          ],
          scaleY: [
            { to: [0.4, 1.5], duration: 120, ease: 'outSine' },
            { to: 0.6, duration: 120, delay: 180, ease: 'inOutSine' },
            { to: 1.2, duration: 180, delay: 25, ease: 'outQuad' },
            { to: 1, duration: 190, delay: 15, ease: 'outQuad' },
          ],
          duration: 400,
          ease: 'outSine',
          delay: stagger(60, { from: 'center' }),
        }, 'POP')
        .add(cube, {
          id: 'cube dot pop',
          // 2D #dot-1 rotate bounce, ported. Launches from the floor into the dot rest above the i. translateY -> world y (x -0.0435).
          y: [
            { from: 0.75, to: 16.9, duration: 240, delay: 0, ease: cubicBezier(0.225, 1, 0.915, 0.98) },
            { to: 7.58, duration: 180, delay: 120, ease: 'inQuad' },
            { to: 11.7, duration: 250, delay: 0, ease: cubicBezier(0.225, 1, 0.915, 0.98) },
            { to: 9.11, duration: 170, delay: 20, ease: 'inQuad' },
            { to: 9.5, duration: 120, delay: 0, ease: 'outQuad' },
          ],
          scaleX: { to: [0.8, 1], duration: 260, delay: 0, ease: 'outQuad' },
          scaleY: { from: 4, to: 1, duration: 120, delay: 0, ease: 'outQuad' },
          scaleZ: { to: [0.8, 1], duration: 260, delay: 0, ease: 'outQuad' },
          transformOriginY: { to: 0, duration: 150, delay: 0, ease: 'out(2)' },
          rotateZ: [
            { to: -540, duration: 480, delay: 20, ease: cubicBezier(0.7865, 0.9809, 0.8395, 0.9559) },
            { to: -720, duration: 540, delay: 160, ease: 'outSine' },
          ],
          skewX: { to: 0, duration: 180, delay: 0, ease: 'out(2)' },
          skewZ: { to: 0, duration: 180, delay: 0, ease: 'out(2)' },
          ease: 'outSine',
        }, 'POP')
        .add(wrapper, {
          id: 'logo punch',
          // 2D #logo punch.
          scale: { from: 1.25, to: 1, duration: 600, delay: 0 },
          y: { from: -5.28, to: 0, duration: 600, delay: 0 },
          duration: 900,
          ease: 'outExpo',
        }, 'POP')
        .add(meshes['i-bar'], {
          id: 'i squish',
          // 2D #i-1 squish.
          scaleY: [
            { to: 0.25, duration: 150, delay: 0, ease: 'outExpo' },
            { to: 1, duration: 700, delay: 0, ease: 'outElastic(2.11, 0.61)' },
          ],
          scaleX: [
            { to: 1.5, duration: 50, delay: 0, ease: 'outSine' },
            { to: 1, duration: 900, delay: 0, ease: 'outElastic(2.11, 0.61)' },
          ],
        }, 'POP+=380')
        .add(camera, {
          id: 'camera pop',
          // End looking straight at the letters, level (rotateX 0).
          y: { to: 7, duration: 1100, ease: 'out(4.9225)' },
          rotateX: [
            { to: 9.1, duration: 260, ease: 'out(3.2713)' },
            { to: 0, duration: 700, ease: 'out(3)', delay: 140 },
          ],
          zoom: { to: 1, duration: 400, ease: 'out(3)' },
        }, 'POP')
        .add(letters, {
          id: 'letters skew',
          // 2D SWEECH, remove the counter-skew so the letters slant into italic.
          skewX: 0,
          duration: 1350,
          ease: 'outElastic(1.1, .9)',
        }, 'POP+=1050')
        .add(cube, {
          id: 'cube sweep',
          // 2D dot SWEECH swoosh, cube sweeps sideways past the word
          // and leans into the italic. The distance is 78.5% of the
          // i-dot -> lockup-right ("h2") distance (see the sweepX
          // derivation above) so the cube lands on-frame, just right
          // of the lockup's middle.
          x: { to: sweepX, duration: 1350 },
          skewX: { to: 8, duration: 1350 },
          duration: 1450,
          ease: 'outElastic(1.1,1.7)',
        }, 'POP+=1050')
        .add(logoGroup, {
          id: 'logo recenter',
          // Slide the lockup left so the word is centered on the camera
          // axis (it starts with the i-dot on the axis, and the word
          // extends further right of the i than left of it). The cube
          // sweep lands pre-shifted to match.
          x: { to: `-=${recenterShift.toFixed(2)}`, duration: 1350, ease: 'outElastic(1.1, .9)' },
          duration: 1250,
          ease: 'inOutQuint',
        }, 'POP+=1050')
        .add(camera, {
          id: 'camera flatten',
          // Narrow the fov to flatten the perspective, the render loop derives z from fov so the framing holds.
          fov: { to: 2, duration: 700, ease: 'out(2)' },
        }, 'POP+=1450')
        .add(flattenDezoom, {
          id: 'camera dezoom',
          // Pull the framing back a touch as it flattens, the render loop scales the dolly distance by this.
          value: { to: 1.5, duration: 1125, delay: 0 },
          duration: 1150, ease: 'out(2)',
        }, 'POP+=1050')
        .add(skyMaterial, {
          id: 'sky to bg',
          // Fade the gradient dome to the flat background color for a clean dark end card.
          topColor: BG, bottomColor: BG,
          duration: 465, ease: 'inOut(4.348)',
        }, 'POP+=1500')
        .add(ambient, {
          id: 'ambient up',
          // Lift ambient as the background goes flat dark so the logo stays bright.
          intensity: [{ to: 3, duration: 300 }, { to: 1, duration: 700, delay: 1050 }],
          duration: 240, ease: 'inOut(1.8042)',
        }, 'POP+=1650')
        .add(camera, {
          id: 'outro depth',
          // Re-add perspective so the meshes flying at the camera read with depth.
          fov: 35,
          duration: 1500, ease: 'out(2)',
        }, 11000)
        .add([...letters, cube], {
          id: 'outro burst',
          // Fly forward and up at the lens, staggered from the end.
          z: 62.1,
          y: 0.5,
          rotateX: () => burstRotX(),
          rotateY: () => burstRotY(),
          rotateZ: () => burstRotZ(),
          delay: stagger(100, { from: 'last', ease: 'in(2.3145)' }),
          duration: 1140, ease: 'in(2)',
        }, 10960)
        .init()

      // Playback: scrub the timeline forward with a slow-mo dip.
      // The demo loops forever; the loader plays ONCE and dismisses.
      player = animate(tl, {
        id: 'Player',
        currentTime: [
          { to: () => tl.labels['slowmo start'], duration: () => tl.labels['slowmo start'], ease: cubicBezier(1, 0.7, 1, 0.85) },
          { to: () => tl.labels['slowmo end'], duration: 2000, ease: cubicBezier(0.0314, 0.3616, 0.8994, -0.2122) },
          { to: () => tl.duration, duration: () => tl.duration - tl.labels['slowmo end'] },
        ],
        duration: tl.duration,
        loop: false,
        ease: 'linear',
        onComplete: dismiss,
      })

      // Render loop: hold the framing as the fov flattens, then draw the
      // scene. Created after the timeline so it can read tl.currentTime:
      //  - the logo stays hidden until POP. The demo parks it below the
      //    floor at y=-5, but on narrow screens the pulled-back camera
      //    can see it lurking there upside-down during the orbit.
      //  - the loader dismisses as the outro burst flies past the
      //    camera (timeline ~11800) instead of sitting on the empty
      //    dark tail until the player ends — the portfolio crossfades
      //    in as the letters exit.
      wrapper.visible = false
      let logoRevealed = false
      renderTimer = createTimer({
        priority: 0,
        onUpdate: () => {
          if (!logoRevealed && tl.currentTime >= 8000) {
            wrapper.visible = true
            logoRevealed = true
          }
          if (tl.currentTime >= 11800) dismiss()
          camera.position.z = FLATTEN_DIST_NUM * flattenDezoom.value * fitFactor / Math.tan(camera.fov * 0.5 * DEG2RAD)
          renderer.render(scene, camera)
        },
      })
    } catch (err) {
      // No WebGL (or any init failure): never trap the visitor on a loader.
      // Log it so a silent skip is diagnosable instead of invisible.
      console.error('[Loader] init failed, skipping loader:', err)
      if (!cancelled) onDone()
      return undefined
    }

    const root = rootRef.current
    const onSkip = () => dismiss()
    root?.addEventListener('click', onSkip)
    return () => {
      cancelled = true
      root?.removeEventListener('click', onSkip)
      if (onResize) window.removeEventListener('resize', onResize)
      try { player?.cancel() } catch { /* already finished */ }
      try { renderTimer?.cancel() } catch { /* already finished */ }
      try { renderer?.dispose() } catch { /* already disposed */ }
      if (renderer?.domElement) renderer.domElement.remove()
    }
  }, [onDone])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault()
      // Reuse the click path: the effect's dismiss is closed over there,
      // so dispatch a click on the overlay instead.
      rootRef.current?.click()
    }
  }

  return (
    <div
      ref={rootRef}
      className={`loader-overlay${fading ? ' is-fading' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="Loading animation — click to skip to the portfolio"
      onKeyDown={onKeyDown}
    >
      <p className="loader-skip">Click to skip</p>
    </div>
  )
}
