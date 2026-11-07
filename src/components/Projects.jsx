import { ExternalLink } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { DataIcon } from './icons.jsx'
import { GithubIcon } from './BrandIcons'
import { FEATURED_PROJECTS, MORE_PROJECTS } from '../data/portfolio'

function ProjectLinks({ github, live }) {
  return (
    <div className="project-links">
      <a href={github} target="_blank" rel="noreferrer" aria-label="View source on GitHub">
        <GithubIcon size={17} />
        GitHub
      </a>
      {live ? (
        <a href={live} target="_blank" rel="noreferrer" aria-label="Open live demo">
          <ExternalLink size={16} aria-hidden="true" />
          Live Demo
        </a>
      ) : null}
    </div>
  )
}

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
        <div className="featured-grid">
          {FEATURED_PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 2) * 80}>
              <article className="project-card">
                <div className="project-head">
                  <span className="project-icon">
                    <DataIcon name={p.icon} size={22} />
                  </span>
                  <div>
                    <h3>{p.name}</h3>
                    <p className="project-tagline">{p.tagline}</p>
                  </div>
                </div>
                <p className="project-problem">{p.problem}</p>
                <ul className="project-features">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="chip-row">
                  {p.stack.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
                <ProjectLinks github={p.github} live={p.live} />
              </article>
            </Reveal>
          ))}
        </div>

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
      </div>
    </section>
  )
}
