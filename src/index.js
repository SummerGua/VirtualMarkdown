import patch from './patch/patch'
import h from './vnode/vnode'
import { Lexer } from './lexer/lexer'
import hljs from 'highlight.js'

const root = document.getElementById('root')
const textarea = document.getElementById('textarea')
const vnodes1 = Lexer.lex('```js\nconsole.log(1)\nconsole\n```\n')
const vnode1 = h('div', { key: 'root' }, vnodes1)

let vnode = [root, vnode1]
patch(vnode[0], vnode[1])
let preview = document.getElementById('preview')
  preview.querySelectorAll('pre code').forEach(item => {
    console.log(item)
    hljs.highlightElement(item)
  })


document.getElementById('btn').addEventListener('click', () => {
  const vnodes2 = Lexer.lex(textarea.value)
  const vnode2 = h('div', { key: 'root' }, vnodes2)
  vnode[0] = vnode[1]
  vnode[1] = vnode2
  patch(vnode[0], vnode[1])
  let preview = document.getElementById('preview')
  preview.querySelectorAll('pre code').forEach(item => {
    console.log(item)
    hljs.highlightElement(item)
  })
})
