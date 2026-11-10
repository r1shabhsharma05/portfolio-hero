import { ArrowUpRight } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import LeetCodeActivityCard from './ui/leetcode-activity-card'
import ActivityTerrain from './ui/activity-terrain'
import {
  LEETCODE_PROFILE_URL,
  LEETCODE_RANK,
  LEETCODE_TOTAL_SOLVED,
  GITHUB_PROFILE_URL,
} from '../data/coding.js'

// LeetCode + GitHub, side by side on desktop, stacked on mobile.
// Numbers are real (fetched 2026-11-10, see src/data/coding.js):
// 211 LeetCode problems solved, global rank 826,410; 819 GitHub
// contributions in the last 26 weeks. The LeetCode rings animate on
// scroll into view; the GitHub terrain is draggable.
export default function CodingProfiles() {
  return (
    <section id="coding" className="section" aria-labelledby="coding-heading">
      <div className="section-inner">
        <Reveal>
          <SectionHeading
            id="coding-heading"
            eyebrow="Coding profiles"
            title="LeetCode & GitHub"
            sub="Real numbers, fetched live — not placeholders. The rings are my LeetCode solves by difficulty; the terrain is my GitHub contributions, week by week."
          />
        </Reveal>

        <Reveal>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={LEETCODE_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
            >
              LeetCode — {LEETCODE_TOTAL_SOLVED} solved · Rank{' '}
              {LEETCODE_RANK.toLocaleString('en-US')}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
            >
              GitHub — 819 contributions · last 26 weeks
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="flex justify-center rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <LeetCodeActivityCard />
            </div>
          </Reveal>
          <Reveal>
            <div className="flex justify-center">
              <ActivityTerrain />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
