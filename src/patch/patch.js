import vnode from '../vnode/vnode'
import createElement from './createElement'

// 情况1：oldVnode是真实DOM return: boolean
function isRealDom(oldVnode) {
  return oldVnode.sel === undefined || oldVnode.sel === ''
}

// 情况2： oldVnode和newVnode是否是同一个节点
function sameNode(oldVnode, newVnode) {
  const isSameKey = oldVnode.key === newVnode.key
  const isSameSel = oldVnode.sel === newVnode.sel
  return isSameKey && isSameSel
}

// patch
export default function (oldVnode, newVnode) {
  // 第一个参数是DOM时，需要包装为虚拟DOM
  if (isRealDom(oldVnode)) {
    oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode, 1)
    console.log('包装了oldVnode')
  }

  if (sameNode(oldVnode, newVnode)) {
    console.log('是同一个节点，需要精细化比较')
  } else {
    console.log('不是同一个节点，插入新，拆除旧')
    let newVnodeElm = createElement(newVnode)
    // 插入到老节点之前
    if (oldVnode.elm.parentNode && newVnodeElm) {
      oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
    }
    oldVnode.elm.parentNode.removeChild(oldVnode.elm) // 删除root
  }
}
