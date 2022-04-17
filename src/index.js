import patch from './patch/patch'
import h from './vnode/vnode'
import { Lexer } from './lexer/lexer'

 

const root = document.getElementById('root')
const vnodes1 = Lexer.lex('# 123\n## 12')
const vnode1 = h('div', {}, vnodes1)

patch(root, vnode1)

// document.getElementById('btn').addEventListener('click',
// () => {
//   patch(vnode1, vnode2)
// }) 
