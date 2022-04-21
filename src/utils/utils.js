export function isSameVnode(oldVnode, newVnode) {
  const isSameKey = oldVnode.key === newVnode.key
  const isSameSel = oldVnode.sel === newVnode.sel
  return isSameKey && isSameSel
}

// oldVnode是真实DOM return: boolean
export function isRealDom(oldVnode) {
  return oldVnode.sel === undefined || oldVnode.sel === ''
}

/**
 * 剪切进入lex的src
 * @param {string} src
 * @param {array} tokens
 * @return {string}
 */
export function cutSrc(src, tokens) {
  return src.substring(tokens[0].length)
}

const caret = /(^|[^\[])\^/g

export function edit(regex, opt) {
  regex = typeof regex === 'string' ? regex : regex.source
  opt = opt || ''
  const obj = {
    replace: (name, val) => {
      val = val.source || val
      val = val.replace(caret, '$1')
      regex = regex.replace(name, val)
      return obj
    },
    getRegex: () => {
      return new RegExp(regex, opt)
    },
  }
  return obj
}
