import { block } from './rules'
import h from '../vnode/vnode'
import { cutSrc } from '../utils/utils'
import inlineLexer from './inlineLexer'
// 块级解析
export class Lexer {
  constructor() {}

  static lex(src) {
    // 静态方法-类名调用 e.g. Lexer.lex(param)
    const lexer = new Lexer()
    let vnodes = lexer.lex(src)
    return lexer.inlineLex(vnodes)
  }

  /**
   *
   * @param {string} src
   * @return vnodes
   */
  lex(src) {
    // 原型方法-实例调用 传入原始markdown
    src = src
      .replace(/\r\n|\r/g, '\n')
      .replace(/\t/g, '    ')
      .replace(/^ +$/gm, '')
    let tokens = []
    let vnodes = []
    while (src) {
      let vnode = null
      // newline
      if ((tokens = block.newline.exec(src))) {
        src = cutSrc(src, tokens)
      }

      // fences
      if ((tokens = block.fences.exec(src))) {
        src = cutSrc(src, tokens)
        let data = {}
        if (tokens[2] != null) {
          data = {
            class: `lang-${tokens[2]}`
          }
        }
        vnode = h('pre', {}, [h('code', data, [], tokens[3] || '')])
        vnodes.push(vnode)
        continue
      }

      // heading
      if ((tokens = block.heading.exec(src))) {
        src = cutSrc(src, tokens)
        vnodes.push(h(`h${tokens[1].length}`, { toInline: tokens[2] }, []))
        continue
      }

      // hr
      if ((tokens = block.hr.exec(src))) {
        src = cutSrc(src, tokens)
        vnodes.push(h('hr', {}, [], ''))
        continue
      }

      // paragraph
      if ((tokens = block.paragraph.exec(src))) {
        src = cutSrc(src, tokens)
        vnode = h('p', {
          toInline:
            tokens[1].charAt(tokens[1].length - 1) === '\n'
              ? tokens[1].slice(0, -1) // 0到最后
              : tokens[1],
        })
        console.log('para', tokens[1])
        vnodes.push(vnode)
        continue
      }

      // 最后是text
      if ((tokens = block.text.exec(src))) {
        src = cutSrc(src, tokens)
        // 应该优化
        // 避免<span><em>1</em></span>
        vnodes.push(h('span', { toInline: tokens[0] }, []))
        continue
      }

      if (src) {
        console.log('仍有未处理的block')
        break
      }
    }
    console.log(vnodes)
    return vnodes
  }

  /**
   * 解析例如 # *header* 的元素
   * @param {array} vnodes
   * @return {array}
   */
  inlineLex(vnodes) {
    let i = 0
    let vnode = vnodes[i]
    while (vnode) {
      if (vnode.toInline) {
        vnode.children = inlineLexer(vnode.toInline)
        vnode.toInline = '' // 置空
      } else {
        // 当前没有需要inline的
        this.inlineLex(vnode.children)
      }
      vnode = vnodes[++i]
    }
    return vnodes // 最后用这个vnodes渲染
  }
}
