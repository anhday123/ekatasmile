export const compare = (a, b, key, convert) => {
  if (convert)
    return convert(a[key]) > convert(b[key])
      ? 1
      : convert(a[key]) === convert(b[key])
      ? 0
      : -1
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
  if (str)
    return str
      .toString()
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ',') + prev
      })
  else return 0
}

export function removeNull(a) {
  return Object.keys(a)
    .filter((key) => a[key] !== '' && a[key] !== undefined)
    .reduce((res, key) => ((res[key] = a[key]), res), {})
}

export function searchTree(element, matchingTitle) {
  if (element.title == matchingTitle) {
    return element
  } else if (element.children != null) {
    var i
    var result = null
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTree(element.children[i], matchingTitle)
    }
    return result
  }
  return null
}

// export const getTreeStructure = (Array_Objects, value)=>{
//   let matched = false
//   let result = []
//   Array_Objects.forEach((object, index)=>{
//       if(typeof object === 'string'){
//         if()
//       }

//   })

//   return []
// }
