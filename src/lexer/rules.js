import { edit } from '../utils/utils'

// 块级规则
export const block = {
  newline: /^(?: *(?:\n|$))+/,
  code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
  // 代码块
  fences: /^ *(`{3,}|~{3,})[ .]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/,
  _paragraph:
    /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
  text: /^[^\n]+/,
  bullet: /(?:[*+-]|\d+\.)/,
}

block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/gm
block.item = edit(block.item, 'gm').replace(/bull/g, block.bullet).getRegex()

block._tag =
  'address|article|aside|base|basefont|blockquote|body|caption' +
  '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption' +
  '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe' +
  '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option' +
  '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr' +
  '|track|ul'

block.blockquote  = edit(block.blockquote).replace('def', block.def).getRegex()

block.list = edit(block.list)
  .replace(/bull/g, block.bullet)
  .replace('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  .replace('def', '\\n+(?=' + block.def.source + ')')
  .getRegex()

block.paragraph = edit(block._paragraph)
  .replace('hr', block.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('|table', '')
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)')
  .replace('tag', block._tag) // pars can be interrupted by type (6) html blocks
  .getRegex()

export const inline = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  _link: /^!?\[(label)\]\(href\)/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: /^[\s\S]+?(?=[\\<![_*`~]|https?:\/\/| *\n|$)/,
  _label: /(?:\[[^\]]*\]|[^[\]]|\](?=[^[]*\]))*/,
  _href: /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/,
}

inline.link = edit(inline._link)
  .replace('label', inline._label)
  .replace('href', inline._href)
  .getRegex()
