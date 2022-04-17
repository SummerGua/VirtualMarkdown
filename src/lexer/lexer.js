import { rules } from './rules'
import h from '../vnode/vnode'
// 块级解析
export class Lexer {
  constructor() {}

  static lex(src) {
    // 静态方法-类名调用 e.g. Lexer.lex(param)
    const lexer = new Lexer()
    return lexer.lex(src)
  }

  lex(src) {
    // 原型方法-实例调用 传入原始markdown
    src = src
      .replace(/\r\n|\r/g, '\n')
      .replace(/\t/g, '    ')
      .replace(/^ +$/gm, '')
    let tokens = []
    let vnodes = []
    while (src) {
      // newline
      // if ((tokens = this.rules.newline.exec(src))) {
      //   src = this.cutSrc(src, tokens)
      //   continue
      // }

      // heading
      if ((tokens = rules.heading.exec(src))) {
        src = this.cutSrc(src, tokens)
        vnodes.push(h(`h${tokens[1].length}`, {}, [], tokens[2]))
        continue
      }
    }
    return vnodes
  }

  cutSrc(src, tokens) {
    return src.substring(tokens[0].length)
  }
}
