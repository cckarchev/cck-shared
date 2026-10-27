// Turns a camelCase token key into the kebab-case suffix of its CSS name, as in
// `belowTablet` to `below-tablet`.
export const toKebabCase = (name: string): string =>
  name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
