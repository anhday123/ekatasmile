export const compare = (a, b, key) => {
  return a[key] > b[key] ? 1 : a[key] === b[key] ? 0 : -1
}

export const compareCustom = (a, b) => {
  return a > b ? 1 : a === b ? 0 : -1
}
