import patch from './patch/patch'
import h from './vnode/vnode'
import { Lexer } from './lexer/lexer'

export default class VirtualMarkdown {
  constructor(rootNodeName) {
    this.rootNodeName = rootNodeName
    this.vnodeRecord = []
    this.firstRenderFlag = true // 首次渲染标记
  }

  /**
   *
   * @param {string} src
   * @return {void}
   */
  render(src) {
    if (this.firstRenderFlag === true) {
      // 首次渲染
      this.vnodeRecord = [
        document.getElementById(this.rootNodeName),
        h('div', { key: 'root', id: this.rootNodeName }, Lexer.lex(src)),
      ]
      this.firstRenderFlag = false
    } else {
      // 不是首次，则将上一次的推到第一个
      this.vnodeRecord[0] = this.vnodeRecord[1]
      this.vnodeRecord[1] = h(
        'div',
        { key: 'root', id: this.rootNodeName },
        Lexer.lex(src)
      )
    }
    patch(this.vnodeRecord[0], this.vnodeRecord[1])
  }
}
