export const camelCaseToFormal = (str: string) =>
  str
    .replace(/([A-Z])/g, ' $1') // uppercase the first character
    .replace(/^./, (str) => str.toUpperCase())
