import { cutSrc } from '../utils/utils'
import { inline } from './rules'
import h from '../vnode/vnode'

export default function inlineLexer(toInlineSrc) {
  let vnodes = []
  let tokens = []
  while (toInlineSrc) {
    let vnode

    // escape
    if ((tokens = inline.escape.exec(toInlineSrc))) {
      toInlineSrc = cutSrc(toInlineSrc, tokens)
      vnode = h('span', {}, [], tokens[1])
      vnodes.push(vnode)
      continue
    }

    // link
    if ((tokens = inline.link.exec(toInlineSrc))) {
      toInlineSrc = cutSrc(toInlineSrc, tokens)
      if (tokens[0].charAt(0) !== '!') {
        // 不是图片，生成链接 图片是![name](http://...)
        vnode = h('a', { href: tokens[2] }, [], tokens[1])
      } else {
        vnode = h('img', { src: tokens[2], alt: tokens[1] })
      }
      vnodes.push(vnode)
      continue
    }

    // strong 优先匹配 **1** 再匹配*1*
    if ((tokens = inline.strong.exec(toInlineSrc))) {
      toInlineSrc = cutSrc(toInlineSrc, tokens)
      // 文字+<em></em>+文字怎么办？节点过多
      vnode = h('strong', {}, inlineLexer(tokens[2] || tokens[1]))
      vnodes.push(vnode)
      continue
    }

    // em
    if ((tokens = inline.em.exec(toInlineSrc))) {
      toInlineSrc = cutSrc(toInlineSrc, tokens)
      vnode = h('em', {}, [], tokens[2] || tokens[1])
      vnodes.push(vnode)
      continue
    }

    // code
    if ((tokens = inline.code.exec(toInlineSrc))) {
      toInlineSrc = cutSrc(toInlineSrc, tokens)
      vnode = h('code', {}, [h('span', {}, [], tokens[2])])
      vnodes.push(vnode)
      continue
    }

    // del
    if ((tokens = inline.del.exec(toInlineSrc))) {
      toInlineSrc = cutSrc(toInlineSrc, tokens)
      vnode = h('del', {}, inlineLexer(tokens[1]))
      vnodes.push(vnode)
      continue
    }

    // text
    if ((tokens = inline.text.exec(toInlineSrc))) {
      toInlineSrc = cutSrc(toInlineSrc, tokens)
      // 文字+<em></em>+文字怎么办？节点过多
      if (tokens[0].replace(/ +/, '') == '') continue
      else {
        // 防止# *1*前面的空格
        tokens[0] = tokens[0].replace(/ +/, '')
        vnode = h('span', {}, [], tokens[0])
        vnodes.push(vnode)
        continue
      }
    }

    if (toInlineSrc) {
      throw new Error('some inline not be processed')
    }
  }
  return vnodes
}
