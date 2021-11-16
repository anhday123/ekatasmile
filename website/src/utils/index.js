import { VERSION_APP } from 'consts'
import { message } from 'antd'

export const compare = (a, b, key, convert) => {
  if (convert)
    return convert(a[key]) > convert(b[key]) ? 1 : convert(a[key]) === convert(b[key]) ? 0 : -1
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

//xoá dấu
export function removeAccents(str) {
  var AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ',
  ]
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g')
    var char = AccentsMap[i][0]
    str = str.replace(re, char)
  }
  return str
}

export const clearBrowserCache = () => {
  let version = localStorage.getItem('version_app')
  if (version !== VERSION_APP) {
    if ('caches' in window) {
      caches.keys().then((names) => {
        // Delete all the cache files
        names.forEach((name) => {
          caches.delete(name)
        })
      })

      // Makes sure the page reloads. Changes are only visible after you refresh.
      window.location.reload(true)
    }

    localStorage.clear()
    localStorage.setItem('version_app', VERSION_APP)
  }
}

export const copyText = (text) => {
  navigator.clipboard.writeText(text)
  message.success('Copied the text')
}
