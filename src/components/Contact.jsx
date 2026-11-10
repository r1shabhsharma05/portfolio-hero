import { Mail } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import SlideToConfirm from './kokonutui/slide-to-confirm'
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
  // Slide-to-confirm fires the resume download (the Contact section has no
  // form — this is its one action). A programmatic anchor click keeps the
  // `download` filename, same as the old Download Resume link.
  const downloadResume = () => {
    const a = document.createElement('a')
    a.href = PERSON.resumeHref
    a.download = 'Rishabh_Sharma_Resume.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

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
            <SlideToConfirm
              label="Slide to download resume"
              confirmingLabel="Downloading"
              doneLabel="Resume downloaded"
              onConfirm={downloadResume}
              resetAfter={3000}
              className="mx-auto"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
