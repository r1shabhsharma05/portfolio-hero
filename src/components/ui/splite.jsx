import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        // wasmPath is a deliberate addition to the pasted component: the
        // runtime fetches its WASM from unpkg / cdn.spline.design by
        // default, both unreachable from the verification VM's Chrome.
        // The WASM ships with the npm package, so it is self-hosted in
        // public/spline-wasm/ (bevel.wasm + process.wasm) — same files,
        // no CDN dependency.
        wasmPath="/spline-wasm"
      />
    </Suspense>
  )
}
