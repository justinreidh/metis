export const LIKERT_OPTIONS = [
  "Very Inaccurate",
  "Moderately Inaccurate",
  "Neither Accurate Nor Inaccurate",
  "Moderately Accurate",
  "Very Accurate",
] as const;

export type LikertValue = 1 | 2 | 3 | 4 | 5;

export type BigFiveTrait =
  | "extraversion"
  | "agreeableness"
  | "conscientiousness"
  | "emotional_stability"
  | "intellect_imagination";

export interface PersonalityQuestion {
  id: number;
  text: string;
  trait: BigFiveTrait;
  reverse: boolean;
}


export const QUESTIONS: PersonalityQuestion[] = [
  { id: 1, text: "Am the life of the party.", trait: "extraversion", reverse: false },
  { id: 2, text: "Feel little concern for others.", trait: "agreeableness", reverse: true },
  { id: 3, text: "Am always prepared.", trait: "conscientiousness", reverse: false },
  { id: 4, text: "Get stressed out easily.", trait: "emotional_stability", reverse: true },
  { id: 5, text: "Have a rich vocabulary.", trait: "intellect_imagination", reverse: false },

  { id: 6, text: "Don't talk a lot.", trait: "extraversion", reverse: true },
  { id: 7, text: "Am interested in people.", trait: "agreeableness", reverse: false },
  { id: 8, text: "Leave my belongings around.", trait: "conscientiousness", reverse: true },
  { id: 9, text: "Am relaxed most of the time.", trait: "emotional_stability", reverse: false },
  { id: 10, text: "Have difficulty understanding abstract ideas.", trait: "intellect_imagination", reverse: true },

  { id: 11, text: "Feel comfortable around people.", trait: "extraversion", reverse: false },
  { id: 12, text: "Insult people.", trait: "agreeableness", reverse: true },
  { id: 13, text: "Pay attention to details.", trait: "conscientiousness", reverse: false },
  { id: 14, text: "Worry about things.", trait: "emotional_stability", reverse: true },
  { id: 15, text: "Have a vivid imagination.", trait: "intellect_imagination", reverse: false },

  { id: 16, text: "Keep in the background.", trait: "extraversion", reverse: true },
  { id: 17, text: "Sympathize with others' feelings.", trait: "agreeableness", reverse: false },
  { id: 18, text: "Make a mess of things.", trait: "conscientiousness", reverse: true },
  { id: 19, text: "Seldom feel blue.", trait: "emotional_stability", reverse: false },
  { id: 20, text: "Am not interested in abstract ideas.", trait: "intellect_imagination", reverse: true },

  { id: 21, text: "Start conversations.", trait: "extraversion", reverse: false },
  { id: 22, text: "Am not interested in other people's problems.", trait: "agreeableness", reverse: true },
  { id: 23, text: "Get chores done right away.", trait: "conscientiousness", reverse: false },
  { id: 24, text: "Am easily disturbed.", trait: "emotional_stability", reverse: true },
  { id: 25, text: "Have excellent ideas.", trait: "intellect_imagination", reverse: false },

  { id: 26, text: "Have little to say.", trait: "extraversion", reverse: true },
  { id: 27, text: "Have a soft heart.", trait: "agreeableness", reverse: false },
  { id: 28, text: "Often forget to put things back in their proper place.", trait: "conscientiousness", reverse: true },
  { id: 29, text: "Get upset easily.", trait: "emotional_stability", reverse: true },
  { id: 30, text: "Do not have a good imagination.", trait: "intellect_imagination", reverse: true },

  { id: 31, text: "Talk to a lot of different people at parties.", trait: "extraversion", reverse: false },
  { id: 32, text: "Am not really interested in others.", trait: "agreeableness", reverse: true },
  { id: 33, text: "Like order.", trait: "conscientiousness", reverse: false },
  { id: 34, text: "Change my mood a lot.", trait: "emotional_stability", reverse: true },
  { id: 35, text: "Am quick to understand things.", trait: "intellect_imagination", reverse: false },

  { id: 36, text: "Don't like to draw attention to myself.", trait: "extraversion", reverse: true },
  { id: 37, text: "Take time out for others.", trait: "agreeableness", reverse: false },
  { id: 38, text: "Shirk my duties.", trait: "conscientiousness", reverse: true },
  { id: 39, text: "Have frequent mood swings.", trait: "emotional_stability", reverse: true },
  { id: 40, text: "Use difficult words.", trait: "intellect_imagination", reverse: false },

  { id: 41, text: "Don't mind being the center of attention.", trait: "extraversion", reverse: false },
  { id: 42, text: "Feel others' emotions.", trait: "agreeableness", reverse: false },
  { id: 43, text: "Follow a schedule.", trait: "conscientiousness", reverse: false },
  { id: 44, text: "Get irritated easily.", trait: "emotional_stability", reverse: true },
  { id: 45, text: "Spend time reflecting on things.", trait: "intellect_imagination", reverse: false },

  { id: 46, text: "Am quiet around strangers.", trait: "extraversion", reverse: true },
  { id: 47, text: "Make people feel at ease.", trait: "agreeableness", reverse: false },
  { id: 48, text: "Am exacting in my work.", trait: "conscientiousness", reverse: false },
  { id: 49, text: "Often feel blue.", trait: "emotional_stability", reverse: true },
  { id: 50, text: "Am full of ideas.", trait: "intellect_imagination", reverse: false },
];


export function scoreResponse(value: LikertValue, reverse: boolean) {
  return reverse ? 6 - value : value;
}


export function calculateTraitScores(
  responses: Record<number, LikertValue>
) {
  const totals = {
    extraversion: 0,
    agreeableness: 0,
    conscientiousness: 0,
    emotional_stability: 0,
    intellect_imagination: 0,
  };

  QUESTIONS.forEach(q => {
    const value = responses[q.id];
    if (!value) return;
    totals[q.trait] += scoreResponse(value, q.reverse);
  });

  return totals;
}