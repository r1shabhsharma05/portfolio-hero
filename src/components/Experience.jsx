import { FlaskConical, GitPullRequest, GraduationCap } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { GithubIcon } from './BrandIcons'
import { EDUCATION, OPEN_SOURCE, PERSON, SIMULATIONS } from '../data/portfolio'

export default function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <div className="section-inner">
        <Reveal>
          <SectionHeading
            id="experience-heading"
            eyebrow="Experience"
            title="Education, open source & simulations"
            sub="Clearly separated — academic work and simulations are never presented as employment. I have no full-time job or internship yet."
          />
        </Reveal>

        <Reveal>
          <h3 className="exp-group-title">
            <GraduationCap size={20} aria-hidden="true" />
            Education
          </h3>
        </Reveal>
        <div className="exp-list">
          {EDUCATION.map((e) => (
            <Reveal key={e.school}>
              <article className="exp-card">
                <div className="exp-main">
                  <h4>{e.degree}</h4>
                  <p className="exp-org">{e.school}</p>
                  <p className="exp-detail">{e.detail}</p>
                </div>
                <div className="exp-side">
                  <p className="exp-period">{e.period}</p>
                  <p className="exp-status">{e.status}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <h3 className="exp-group-title">
            <GitPullRequest size={20} aria-hidden="true" />
            Open-source contributions
          </h3>
        </Reveal>
        <Reveal>
          <article className="exp-card oss-card">
            <div className="exp-main">
              <p className="exp-detail">{OPEN_SOURCE.summary}</p>
              <p className="exp-highlight">{OPEN_SOURCE.highlight}</p>
            </div>
            <a
              className="exp-link"
              href={PERSON.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Rishabh Sharma on GitHub"
            >
              <GithubIcon size={17} />
              github.com/r1shabhsharma05
            </a>
          </article>
        </Reveal>

        <Reveal>
          <h3 className="exp-group-title">
            <FlaskConical size={20} aria-hidden="true" />
            Job simulations
          </h3>
        </Reveal>
        <Reveal>
          <p className="exp-note">
            Short job simulations on Forage — hands-on learning experiences, not
            employment.
          </p>
        </Reveal>
        <div className="sim-grid">
          {SIMULATIONS.map((s) => (
            <Reveal key={s.org}>
              <article className="sim-card">
                <h4>{s.org}</h4>
                <p className="exp-detail">{s.area}</p>
                <p className="exp-status">Job simulation (Forage)</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
