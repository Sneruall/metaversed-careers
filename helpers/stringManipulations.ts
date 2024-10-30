// Helper to apply a series of transformations
const applyTransformations = (
  input: string,
  transformations: ((str: string) => string)[]
) => {
  return transformations.reduce((str, fn) => fn(str), input);
};

// General cleanup functions
const removePercentageSign = (input: string) => input.replace(/%/g, '');
const removeHashtagSign = (input: string) => input.replace(/#/g, '');
const removeCommas = (input: string) => input.replace(/,/g, '');
const removeRepeatingCharacters =
  (pattern: RegExp, replacement: string) => (input: string) =>
    input.replace(pattern, replacement);

// Primary transformation functions
export const replaceCharactersByWhitespace = (input: string) =>
  applyTransformations(input.replace(/[-\/]/g, ' '), [
    removeRepeatingCharacters(/  +/g, ' '),
    removePercentageSign,
    removeHashtagSign,
    removeCommas,
  ]);

export const replaceCharactersByDash = (input: string) =>
  applyTransformations(input.replace(/[\s\/]/g, '-'), [
    removeRepeatingCharacters(/-{2,}/g, '-'),
    removePercentageSign,
    removeHashtagSign,
    removeCommas,
  ]);

// Utility function
export const capitalizeFirstLetter = (text?: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : null;
