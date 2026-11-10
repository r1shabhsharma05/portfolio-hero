import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { DataIcon } from './icons.jsx'
import { ProjectLinks } from './ProjectLinks'
import ProjectCarousel from './ProjectCarousel'
import { FEATURED_PROJECTS, MORE_PROJECTS } from '../data/portfolio'
import secureguardImg from '../assets/projects/secureguard.jpg'
import safelifeImg from '../assets/projects/safelife.jpg'
import railsyncImg from '../assets/projects/railsync.jpg'
import farmerImg from '../assets/projects/farmer.jpg'
import localkartImg from '../assets/projects/localkart.jpg'
import healthcareImg from '../assets/projects/healthcare.jpg'
import morphaiImg from '../assets/projects/morphai.jpg'

const CAROUSEL_IMAGES = {
  SecureGaurd: secureguardImg,
  SafeLife: safelifeImg,
  'RailSync 2.0': railsyncImg,
  'Farmer Marketplace': farmerImg,
}

/* The carousel shows the 4 featured projects plus LocalKart and
   Healthcare Hub, which Rishabh promoted with photos of their own.
   They leave the "More projects" grid below, so no project appears twice. */
const CAROUSEL_ITEMS = [
  ...FEATURED_PROJECTS.map((p) => ({ ...p, image: CAROUSEL_IMAGES[p.name] })),
  {
    name: 'LocalKart',
    icon: 'Boxes',
    tagline: 'Campus marketplace',
    problem:
      'A marketplace for campus — list, chat, sell. JWT auth with email verification codes, 5 photos max per listing, sold flow and 120 demo seed listings.',
    features: [
      'JWT auth with email verification codes',
      '5 photos max per listing',
      'Sold flow with buyer–seller chat',
    ],
    stack: ['React', 'Vite', 'Node.js', 'Express', 'MongoDB Atlas'],
    github: 'https://github.com/r1shabhsharma05/LocalKart',
    live: 'https://localkart-jet.vercel.app',
    image: localkartImg,
  },
  {
    name: 'Healthcare Hub',
    icon: 'Stethoscope',
    tagline: 'Nearby hospitals, appointments, AI chat',
    problem:
      'Find nearby hospitals on a map, book appointments and ask a Gemini-powered AI assistant — with Supabase Auth and row-level security.',
    features: [
      'Nearby hospitals on a map',
      'Appointment booking',
      'Gemini-powered AI assistant',
      'Supabase Auth + row-level security',
    ],
    stack: ['React', 'Vite', 'Axios', 'Leaflet', 'Node.js', 'Express', 'Supabase', 'Gemini AI'],
    github: 'https://github.com/r1shabhsharma05/Mini-Project',
    live: null,
    image: healthcareImg,
  },
  {
    name: 'MorphAI',
    icon: 'Sparkles',
    tagline: 'Education-focused 3D learning landing page',
    problem:
      'Learn visually: Three.js 3D models, animated concept lessons and an image-to-3D workflow on an education landing page.',
    features: ['Three.js 3D models', 'Animated concept lessons', 'Image-to-3D workflow'],
    stack: ['TypeScript', 'Three.js', 'Express', 'tRPC', 'MySQL', 'Drizzle'],
    github: 'https://github.com/r1shabhsharma05/MorphAi',
    live: null,
    image: morphaiImg,
  },
]

export default function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="section-inner">
        <Reveal>
          <SectionHeading
            id="projects-heading"
            eyebrow="Projects"
            title="Featured projects"
            sub="Real products, live and measurable — every number below is verified, and every link resolves."
          />
        </Reveal>
        <Reveal>
          <ProjectCarousel items={CAROUSEL_ITEMS} />
        </Reveal>

        {MORE_PROJECTS.length > 0 && (
          <>
            <Reveal>
              <h3 className="more-heading">More projects</h3>
            </Reveal>
            <div className="more-grid">
              {MORE_PROJECTS.map((p, i) => (
                <Reveal key={p.name} delay={(i % 2) * 80}>
                  <article className="more-card">
                    <div className="project-head">
                      <span className="project-icon">
                        <DataIcon name={p.icon} size={20} />
                      </span>
                      <div>
                        <h3>{p.name}</h3>
                        <p className="project-tagline">{p.tagline}</p>
                      </div>
                    </div>
                    <p className="project-problem">{p.description}</p>
                    <div className="chip-row">
                      {p.stack.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                    <ProjectLinks github={p.github} live={null} />
                  </article>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
