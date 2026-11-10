import { ExternalLink } from 'lucide-react'
import { GithubIcon } from './BrandIcons'

export function ProjectLinks({ github, live }) {
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
