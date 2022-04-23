import VirtualMarkdown from './virtualMarkdown'

const btn = document.getElementById('btn')

const vm = new VirtualMarkdown('root')
btn.addEventListener('click', () => {
  const toRenderSrc = document.getElementById('textarea').value
  vm.render(toRenderSrc)
})
