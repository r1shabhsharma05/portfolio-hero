import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { DataIcon } from './icons.jsx'
import { SKILL_GROUPS } from '../data/portfolio'

export default function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-heading">
      <div className="section-inner">
        <Reveal>
          <SectionHeading
            id="skills-heading"
            eyebrow="Skills"
            title="Technical skills"
            sub="Technologies I actually use in my projects — no percentages, no filler."
          />
        </Reveal>
        <div className="skill-grid">
          {SKILL_GROUPS.map((g, i) => (
            <Reveal key={g.title} delay={(i % 3) * 70}>
              <article className="skill-card">
                <div className="skill-card-head">
                  <span className="skill-icon">
                    <DataIcon name={g.icon} size={20} />
                  </span>
                  <h3>{g.title}</h3>
                </div>
                <div className="chip-row">
                  {g.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
