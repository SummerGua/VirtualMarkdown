import { block } from './rules'
import h from '../vnode/vnode'
import { cutSrc } from '../utils/utils'
import inlineLexer from './inlineLexer'
// 块级解析
export class Lexer {
  constructor() {}

  static lex(src) {
    // 静态方法-类名调用 Lexer.lex(param)
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
            class: `lang-${tokens[2]}`,
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

      // blockquote
      if ((tokens = block.blockquote.exec(src))) {
        src = cutSrc(src, tokens)
        tokens = tokens[0].replace(/^ *> ?/gm, '')
        vnodes.push(h('blockquote', {}, this.lex(tokens)))
        continue
      }

      // list
      if ((tokens = block.list.exec(src))) {
        src = cutSrc(src, tokens)
        let bull = tokens[2]
        tokens = tokens[0].match(block.item)

        let i = 0
        const list = []
        for (; i < tokens.length; i++) {
          let item = tokens[i]
          let space = item.length
          item = item.replace(/^ *([*+-]|\d+\.) +/, '')

          // 减少缩进
          if (~item.indexOf('\n ')) {
            space -= item.length
            item = item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
          }

          // 确定下一个列表项是否属于这里。
          if (i !== tokens.length - 1) {
            let b = block.bullet.exec(tokens[i + 1])[0]
            if (bull !== b && !(bull.length > 1 && b.length > 1)) {
              src = tokens.slice(i + 1).join('\n') + src
              i = tokens.length - 1
            }
          }
          list.push(this.lex(item))
        }
        vnode = h(
          bull.length > 1 ? 'ol' : 'ul',
          {},
          list.map((li) => {
            return h('li', {}, li)
          })
        )
        vnodes.push(vnode)
        continue
      }

      // table
      if ((tokens = block.table.exec(src))) {
        src = cutSrc(src, tokens)
        const thead = tokens[1].replace(/^ *| *\| *$/g, '').split(/ *\| */)
        const align = tokens[2]
          .replace(/^ *|\| *$/g, '')
          .split(/ *\| */)
          .map((al) => {
            if (/^ *-+: *$/.test(al)) {
              return 'right'
            } else if (/^ *:-+: *$/.test(al)) {
              return 'center'
            } else if (/^ *:-+ *$/.test(al)) {
              return 'left'
            } else {
              return null
            }
          })

        const tbody = tokens[3]
          .replace(/(?: *\| *)?\n$/, '')
          .split('\n')
          .map((tr) => {
            return tr.replace(/^ *\| *| *\| *$/g, '').split(/ *\| */)
          })
        vnodes.push(this.lexTable(thead, tbody, align))
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
        throw new Error('some block not be processed')
      }
    }
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

  /**
   * 解析表格
   * @param thead
   * @param tbody
   * @param align
   */
  lexTable(thead, tbody, align) {
    const vnode = h('table', {}, [
      h('thead', {}, [
        h(
          'tr',
          {},
          thead.map((th, index) => {
            const data = {}
            if (align[index] != null) {
              data['align'] = align[index]
            }
            const inline = {
              toInline: th,
            }
            return h('th', { ...data, ...inline })
          })
        ),
      ]),
      h(
        'tbody',
        {},
        tbody.map((tr) => {
          return h(
            'tr',
            {},
            tr.map((td, index) => {
              const data = {}
              if (align[index] != null) {
                data['align'] = align[index]
              }
              const inline = {
                toInline: td,
              }
              return h('td', { ...data, ...inline })
            })
          )
        })
      ),
    ])
    return vnode
  }
}
