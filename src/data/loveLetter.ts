export type LoveLetterDefinition = {
  eyebrow: string
  title: string
  paragraphs: readonly string[]
  closing: string
  signature: string
}

/**
 * Edit this copy to make the letter yours. Paragraphs reveal one by one as she scrolls.
 */
export const LOVE_LETTER: LoveLetterDefinition = {
  eyebrow: 'A note for you',
  title: 'My love',
  paragraphs: [
    'On your birthday, I want you to know something simple and true: you have changed the way my world feels—softer, brighter, and more like home.',
    'I am grateful for the little moments with you—the laughter, the quiet, the way time bends when we are together. They are the parts of life I never want to take for granted.',
    'Whatever this next year brings, I hope it brings you peace when you need it, joy when you deserve it, and the certainty that you are deeply loved—today and always.',
  ],
  closing: 'Forever yours,',
  signature: '— Me',
}
