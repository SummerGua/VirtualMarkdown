// h函数
export default function (sel, data, children, text, elm, key) {
  return {
    sel, // selector
    data, // some props
    children, // array
    text, // string
    elm,
    key, // unique key
  }
}
