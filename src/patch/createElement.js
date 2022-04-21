// 根据vnode创建真实DOM
export default function createElement(vnode) {
  //↓ if sel = div, domNode = read <div> DOM
  let domNode = document.createElement(vnode.sel)
  // 添加属性
  if (vnode.data) {
    Object.keys(vnode.data).forEach((key) => {
      if (key !== 'key' && key !== 'toInline') {
        // 不是链接的就不要加上来啦
        domNode.setAttribute(key, vnode.data[key])
      }
    })
  }
  if (vnode.text != '' && (vnode.children === undefined || vnode.children.length === 0)) {
    /* 内部是文字<div>123</div>而不是
      <ul>
      123 此处散文字 接着还有子标签
      <li>1</li>
      </ul>
    */
    // 将vnode的文字放到真实dom去
    domNode.textContent = vnode.text
  } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
    // h('div', {}, [h(...)])需要递归创建
    for (let i = 0; i < vnode.children.length; i++) {
      let ch = vnode.children[i]
      // 此时真实节点带上了child
      domNode.appendChild(createElement(ch))
    }
  }
  vnode.elm = domNode // 补充属性
  return vnode.elm // 返回真实DOM用于insertBefore
}
