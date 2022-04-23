# VirtualMarkdown
*A Markdown Renderer with Virtual DOM*

- Inspired by Snabbdom and MarkedJS
- Driven by webpack

## Refrence:
- [Snabbdom](https://github.com/snabbdom/snabbdom)
- [MarkedJS](https://github.com/markedjs/marked)
- [Markdown365-parser](https://github.com/nashaofu/markdown365-parser)


## Run
`npm install` for init

`npm run serve` for HMR

`npm run build` for packing

## Usage
```js
import VirtualMarkdown from './virtualMarkdown'

// get root element
const btn = document.getElementById('btn')
const vm = new VirtualMarkdown('root')

btn.addEventListener('click', () => {
  const toRenderSrc = document.getElementById('textarea').value
  vm.render(toRenderSrc) // start to update nodes
})
```

## Supported syntax

```
h1~h6
ol-li
ul-li
table
code block
blockquote
link or image
hr
italic
del
bold
```