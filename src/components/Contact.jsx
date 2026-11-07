import { Download, Mail } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { PERSON } from '../data/portfolio'

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: PERSON.email,
    href: `mailto:${PERSON.email}`,
    icon: <Mail size={20} aria-hidden="true" />,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/rishabh-sharma-342575438',
    href: PERSON.linkedin,
    icon: <LinkedinIcon size={20} />,
  },
  {
    label: 'GitHub',
    value: 'github.com/r1shabhsharma05',
    href: PERSON.github,
    icon: <GithubIcon size={20} />,
  },
]

export default function Contact() {
  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="section-inner">
        <Reveal>
          <SectionHeading
            id="contact-heading"
            eyebrow="Contact"
            title="Let's build something real"
            sub="I'm open to software engineering roles and interesting projects. The fastest way to reach me is email."
          />
        </Reveal>
        <div className="contact-grid">
          {CONTACT_LINKS.map((c) => (
            <Reveal key={c.label}>
              <a
                className="contact-card"
                href={c.href}
                {...(c.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })}
              >
                <span className="contact-icon">{c.icon}</span>
                <span className="contact-label">{c.label}</span>
                <span className="contact-value">{c.value}</span>
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="contact-cta">
            <a
              className="btn-primary"
              href={PERSON.resumeHref}
              download="Rishabh_Sharma_Resume.pdf"
            >
              <Download size={18} aria-hidden="true" />
              Download Resume
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
