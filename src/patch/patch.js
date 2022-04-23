import h from '../vnode/vnode'
import createElement from './createElement'
import updateChildren from './updateChildren'
import { isSameVnode, isRealDom } from '../utils/utils'

// patch
export default function patch(oldVnode, newVnode) {
  newVnode.elm = oldVnode.elm
  // 第一个参数是DOM时，需要包装为虚拟DOM
  if (isRealDom(oldVnode)) {
    oldVnode = h(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)
  }

  if (isSameVnode(oldVnode, newVnode)) {
    // 最难的地方 同一个节点，需要精细化比较
    // 内存中同一个对象 e.g. patch(vnode1, vnode1)
    if (oldVnode === newVnode) {
      return
    }
    if (newVnode.data !== oldVnode.data) {
      // 属性不一样
      const data = {
        ...newVnode.data,
        ...oldVnode.data,
      }
      Object.keys(data).forEach((key) => {
        if (key !== 'key' && key !== 'toInline') {
          if (newVnode.data[key] == null) {
            oldVnode.elm.removeAttribute(key)
          } else if (newVnode.data[key] !== oldVnode.data[key]) {
            oldVnode.elm.setAttribute(key, newVnode.data[key])
          }
        }
      })
    }
    // 判断新vnode有没有text属性
    if (
      newVnode !== undefined &&
      (newVnode.children === undefined || newVnode.children.length === 0)
    ) {
      // 新vnode有text属性
      if (newVnode.text !== oldVnode.text) {
        // text不一样则改变oldVnode.elm的textContent
        oldVnode.elm.textContent = newVnode.text
      }
    } else {
      // 新vnode无text属性
      // 判断老vnode有没有children
      if (oldVnode.children !== undefined && oldVnode.children.length > 0) {
        // 老vnode和新vnode都有children，最复杂！
        // 用newVnode.elm亦可，因为新旧一样
        updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
      } else {
        // 老没有children，新有
        oldVnode.elm.innerHTML = ''
        for (let i = 0; i < newVnode.children.length; i++) {
          let dom = createElement(newVnode.children[i])
          oldVnode.elm.appendChild(dom)
        }
      }
    }
  } else {
    //不是同一个节点，插入新，拆除旧
    let newVnodeElm = createElement(newVnode)
    // 插入到老节点之前
    if (oldVnode.elm.parentNode && newVnodeElm) {
      oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
    }
    oldVnode.elm.parentNode.removeChild(oldVnode.elm) // 删除root
  }
}
