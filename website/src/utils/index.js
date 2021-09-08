export const compare = (a, b, key) => {
  return a[key] > b[key] ? 1 : a[key] === b[key] ? 0 : -1
}

export const compareCustom = (a, b) => {
  return a > b ? 1 : a === b ? 0 : -1
}

export const tableSum = (arr, key) => {
  const getValue = (obj, key) => {
    try {
      return key.split('.').reduce((a, b) => {
        return a[b] || 0
      }, obj)
    } catch (e) {
      return 0
    }
  }
  try {
    return arr.reduce((a, b) => a + parseInt(getValue(b, key)), 0)
  } catch (err) {
    console.log(err)
    return 0
  }
}

export function formatCash(str) {
  return str
    .toString()
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ',') + prev
    })
}
