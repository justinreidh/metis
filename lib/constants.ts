interface BenchmarkRange {
  min: number
  ideal: number
  max: number
}

export const HIGH_PERFORMER_BENCHMARKS = {
  gca: { min: 75, ideal: 85, max: 99 } satisfies BenchmarkRange,
  personality: {
    extraversion:          { min: 60, ideal: 80, max: 99 } satisfies BenchmarkRange,
    agreeableness:         { min: 40, ideal: 60, max: 99 } satisfies BenchmarkRange,
    conscientiousness:     { min: 70, ideal: 85, max: 99 } satisfies BenchmarkRange,
    emotional_stability:   { min: 60, ideal: 80, max: 99 } satisfies BenchmarkRange,
    intellect_imagination: { min: 65, ideal: 80, max: 99 } satisfies BenchmarkRange,
  },
} as const