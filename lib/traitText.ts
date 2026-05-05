export type TraitLevel = 'high' | 'moderate' | 'low'

export type TraitKey =
  | 'conscientiousness'
  | 'emotional_stability'
  | 'agreeableness'
  | 'extraversion'
  | 'intellect_imagination'

export const TRAIT_TEXT: Record<TraitKey, Record<TraitLevel, string>> = {
  conscientiousness: {
    high:
      `A high conscientiousness score indicates strong discipline, structure, and a consistent tendency to follow through on commitments. Individuals with this profile are typically highly reliable, organized, and goal-oriented in both independent and team settings. They are more likely to plan ahead, meet deadlines, and maintain sustained effort over long periods. This trait is one of the strongest predictors of job performance across most professional roles.`,

    moderate:
      `A moderate conscientiousness score indicates a generally dependable and reasonably structured work style, though with some variability in consistency. Individuals can be organized and goal-directed but may occasionally struggle with sustained focus or long-term planning. They perform well in flexible environments where strict structure is not always required. Overall, they are capable contributors who may benefit from external accountability.`,

    low:
      `A low conscientiousness score indicates a tendency toward flexibility over structure, with less consistent follow-through on long-term goals. Individuals may struggle with organization, planning, or sustained effort without external pressure. They may excel in dynamic environments but can find routine or detail-heavy work challenging. External structure often significantly improves performance.`,
  },

  emotional_stability: {
    high:
      `A high emotional stability score indicates strong resilience under pressure and a calm, composed response to stress. Individuals maintain consistent performance in demanding environments and are less prone to emotional volatility. They tend to remain effective decision-makers in uncertainty or conflict. This trait is valuable in leadership and high-pressure roles.`,

    moderate:
      `A moderate emotional stability score indicates a generally balanced emotional response, with occasional sensitivity to stress depending on context. Individuals are usually able to maintain performance under pressure but may experience dips in highly demanding situations. They recover well from setbacks and benefit from structured coping strategies. Overall, they demonstrate functional resilience.`,

    low:
      `A low emotional stability score indicates heightened sensitivity to stress and emotional reactivity under pressure. Performance may fluctuate in uncertain or high-pressure environments. These individuals benefit from supportive structures and clear expectations. However, this sensitivity can also enhance interpersonal awareness.`,
  },

  agreeableness: {
    high:
      `A high agreeableness score indicates strong cooperativeness, empathy, and a natural tendency toward interpersonal harmony. Individuals are typically supportive, trusting, and effective in collaborative environments. They help maintain team cohesion and positive communication. However, they may avoid necessary conflict.`,

    moderate:
      `A moderate agreeableness score indicates a balanced interpersonal style that combines cooperation with independent judgment. Individuals adapt well to both teamwork and independent decision-making. They can collaborate effectively while still asserting their perspective. This makes them versatile in most environments.`,

    low:
      `A low agreeableness score indicates a more direct, independent, and critical interpersonal style. Individuals prioritize outcomes over harmony and are comfortable challenging ideas. This is valuable in analytical or decision-heavy roles. However, it can sometimes create interpersonal tension.`,
  },

  extraversion: {
    high:
      `A high extraversion score indicates strong social energy, assertiveness, and comfort in interactive environments. Individuals thrive in collaboration, leadership, and client-facing roles. They are energized by external engagement and group activity. However, they may find solitary work less stimulating.`,

    moderate:
      `A moderate extraversion score indicates a flexible social style that adapts to both collaborative and independent work. Individuals perform well in group settings but also maintain focus in solo tasks. They adjust energy levels based on context. This adaptability is broadly useful.`,

    low:
      `A low extraversion score indicates a preference for independent, focused work and lower social stimulation. Individuals are often reflective and internally driven. They excel in analytical or deep-focus environments. While less outwardly expressive, they are typically consistent contributors.`,
  },

  intellect_imagination: {
    high:
      `A high openness score indicates strong curiosity, creativity, and receptiveness to new ideas. Individuals tend to explore abstract thinking and innovative approaches. They thrive in dynamic, change-oriented environments. This trait is strongly linked to creativity and adaptability.`,

    moderate:
      `A moderate openness score indicates a balance between creativity and practical thinking. Individuals are open to new ideas but evaluate them realistically. They adapt when needed but prefer some structure. This balance supports both innovation and execution.`,

    low:
      `A low openness score indicates a preference for structure, familiarity, and established methods. Individuals are practical, consistent, and methodical. They perform well in stable, rule-based environments. While less experimental, they provide reliability and predictability.`,
  },
}