import patch from './patch'
import { isSameVnode } from '../utils/utils'
import createElement from './createElement'
/*
  传入父节点、旧子元素、新子元素
*/
export default function updateChildren(parentElm, oldChildren, newChildren) {
  let oldStartIdx = 0 // 旧前
  let newStartIdx = 0 // 新前
  let oldEndIdx = oldChildren.length - 1 // 旧后
  let newEndIdx = newChildren.length - 1 // 新后
  let oldStartVnode = oldChildren[0] // 旧前vnode
  let newStartVnode = newChildren[0] // 新前vnode
  let oldEndVnode = oldChildren[oldEndIdx] // 旧后vnode
  let newEndVnode = newChildren[newEndIdx] // 新后vnode
  let keyMap = null

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 已经标记为undefined则略过
    if (oldStartVnode == null) {
      oldStartVnode = oldChildren[++oldStartIdx]
    } else if (oldEndVnode == null) {
      oldEndVnode = oldChildren[--oldEndIdx]
    } else if (newStartVnode == null) {
      newStartVnode = newChildren[++newStartIdx]
    } else if (newEndVnode == null) {
      newEndVnode = newChildren[--newEndIdx]
    }
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      // 新前和旧前
      patch(oldStartVnode, newStartVnode)
      oldStartVnode = oldChildren[++oldStartIdx]
      newStartVnode = newChildren[++newStartIdx]
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 新后和旧后
      patch(oldEndVnode, newEndVnode)
      oldEndVnode = oldChildren[--oldEndIdx]
      newEndVnode = newChildren[--newEndIdx]
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      // 新后与旧前 移动节点
      patch(oldStartVnode, newEndVnode)
      // nextSibling 为隔壁兄弟节点
      // insertBefore 把 参数1（旧前）插到 参数2（旧尾部）前 且是移动而不是复制一份
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling)
      oldStartVnode = oldChildren[++oldStartIdx]
      newEndVnode = newChildren[--newEndIdx]
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      // 新前与旧后
      patch(oldEndVnode, newStartVnode)
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldChildren[--oldEndIdx]
      newStartVnode = newChildren[++newStartIdx]
    } else {
      // 首尾四种均未命中
      // 制作一个映射 { A: 0, B: 1, ... }
      if (!keyMap) {
        keyMap = {}
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
          const key = oldChildren[i]?.key
          if (key != undefined) {
            keyMap[key] = i
          }
        }
      }
      // 寻找newStartIdx在keymap中的位置
      const idxInOld = keyMap[newStartVnode.key]
      if (idxInOld === undefined) {
        // 如果idxInOld为undefined，则表示新vnode没有在旧中出现过，全新的一项
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      } else {
        // 出现在old里，则移动
        const elmToMove = oldChildren[idxInOld] // 要移动的项
        if (elmToMove.sel !== newStartVnode.sel) {
          parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
        } else {
          patch(elmToMove, newStartVnode)
          oldChildren[idxInOld] = undefined // 表示已经处理完
          parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
        }
      }
      newStartVnode = newChildren[++newStartIdx]
    }
  }

  if (newStartIdx <= newEndIdx) {
    // 两个new之间仍然存在节点
    const pivot =
      newChildren[newEndIdx + 1] == null ? null : newChildren[newEndIdx + 1].elm
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      parentElm.insertBefore(createElement(newChildren[i]), pivot)
    }
  } else if (oldStartIdx <= oldEndIdx) {
    // 两个old之间仍然存在节点
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      if (oldChildren[i]) {
        parentElm.removeChild(oldChildren[i].elm)
      }
    }
  }
}
