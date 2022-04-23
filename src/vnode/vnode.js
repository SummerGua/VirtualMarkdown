// h函数
export default function (sel, data, children, text, elm) {
  let key = data.key
  let toInline = data.toInline
  return {
    sel, // selector
    data, // some props
    children, // array
    text, // string
    elm,
    key, // unique key
    toInline // neet to inlineLexer()
  }
}
