import { Code2, GitPullRequest, GraduationCap, MapPin } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const FACTS = [
  { icon: MapPin, label: 'Location', value: 'Bulandshahr, Uttar Pradesh, India' },
  { icon: GraduationCap, label: 'Education', value: 'B.Tech Computer Science (pursuing), GLA University' },
  { icon: Code2, label: 'Focus', value: 'Full-stack, backend engineering & AI/ML' },
  { icon: GitPullRequest, label: 'Open source', value: '14 pull requests merged' },
]

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="section-inner">
        <Reveal>
          <SectionHeading
            id="about-heading"
            eyebrow="About"
            title="Software engineer who ships real products"
            sub="I learn by building — and I measure what I build."
          />
        </Reveal>
        <Reveal>
          <div className="about-body">
            <p>
              I&rsquo;m Rishabh Sharma, a Computer Science undergraduate at GLA University,
              Mathura, and a full-stack developer from Bulandshahr, India. I build real,
              working software: a live vulnerability scanner, a safety app with SOS
              confirmed working on real phones, and an AI-powered railway planning
              tool — all shipped, tested and measured, not just started.
            </p>
            <p>
              My stack is React and React Native up front, Node.js, Express and FastAPI
              behind it, and Supabase and PostgreSQL underneath, with machine learning
              (XGBoost) where it genuinely helps. I care about correctness over claims:
              measured results, tested code, and numbers I can stand behind. I&rsquo;m
              also an open-source contributor, with 14 pull requests merged across
              Jenkins, WordPress/Gutenberg and other projects.
            </p>
            <p>
              I&rsquo;m looking for software engineering roles where I can keep building
              real products and learn from engineers better than me.
            </p>
          </div>
        </Reveal>
        <div className="fact-grid">
          {FACTS.map((f) => (
            <Reveal key={f.label} delay={60}>
              <div className="fact-card">
                <f.icon size={20} aria-hidden="true" />
                <div>
                  <p className="fact-label">{f.label}</p>
                  <p className="fact-value">{f.value}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
