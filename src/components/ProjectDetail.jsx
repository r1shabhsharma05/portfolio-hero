import { useEffect, useRef } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react'
import { GithubIcon } from './BrandIcons'

/**
 * Full-screen project page. Opens from the fan's Details button as a
 * fixed overlay (the portfolio has no router): its own scroll, the full
 * photo uncropped (object-fit: contain — the fan's portrait cards crop
 * landscape photos, this page shows the whole image), every feature, the
 * full stack and every link. The carousel owns the ?project=<slug> URL,
 * so this page is deep-linkable and the browser back button closes it.
 */
export default function ProjectDetail({ project, index, total, onClose, onNavigate }) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="project-detail"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} — project details`}
    >
      <div className="project-detail-bar">
        <button type="button" className="project-detail-back" onClick={onClose}>
          <ArrowLeft size={18} aria-hidden="true" />
          Back to projects
        </button>
        <button
          type="button"
          ref={closeRef}
          className="project-detail-close"
          onClick={onClose}
          aria-label="Close project details"
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="project-detail-scroll">
        <div className="project-detail-hero">
          <img src={project.image} alt={`${project.name} preview`} />
        </div>

        <div className="project-detail-body">
          <p className="project-detail-tagline">{project.tagline}</p>
          <h2 className="project-detail-title">{project.name}</h2>
          <p className="project-detail-desc">{project.problem}</p>

          {project.features && project.features.length > 0 && (
            <>
              <h3 className="project-detail-heading">Highlights</h3>
              <ul className="project-detail-features">
                {project.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </>
          )}

          {project.stack && project.stack.length > 0 && (
            <>
              <h3 className="project-detail-heading">Stack</h3>
              <div className="chip-row">
                {project.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="project-detail-links">
            <a
              className="fan-action-btn fan-action-btn-primary"
              href={project.github}
              target="_blank"
              rel="noreferrer"
            >
              <GithubIcon size={17} />
              GitHub
            </a>
            {project.live ? (
              <a
                className="fan-action-btn"
                href={project.live}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink size={16} aria-hidden="true" />
                Live Demo
              </a>
            ) : null}
          </div>

          <div className="project-detail-nav">
            <button
              type="button"
              className="fan-arrow"
              onClick={() => onNavigate(index - 1)}
              disabled={index <= 0}
              aria-label="Previous project"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <span className="fan-numbers" aria-live="polite">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="fan-arrow"
              onClick={() => onNavigate(index + 1)}
              disabled={index >= total - 1}
              aria-label="Next project"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
