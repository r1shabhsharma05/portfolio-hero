import { ArrowUp, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { PERSON } from '../data/portfolio'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="footer-name">{PERSON.name}</p>
          <p className="footer-role">Software Engineer</p>
        </div>
        <div className="footer-social">
          <a href={PERSON.github} target="_blank" rel="noreferrer" aria-label="Rishabh Sharma on GitHub">
            <GithubIcon size={18} />
          </a>
          <a href={PERSON.linkedin} target="_blank" rel="noreferrer" aria-label="Rishabh Sharma on LinkedIn">
            <LinkedinIcon size={18} />
          </a>
          <a href={`mailto:${PERSON.email}`} aria-label="Email Rishabh Sharma">
            <Mail size={18} aria-hidden="true" />
          </a>
        </div>
        <p className="footer-copy">© {year} {PERSON.name}. All rights reserved.</p>
        <a className="back-to-top" href="#home">
          <ArrowUp size={15} aria-hidden="true" />
          Back to top
        </a>
      </div>
    </footer>
  )
}
