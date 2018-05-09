import { getWord } from './wordDict'
const tagSet = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'B', 'SMALL', 'STRONG', 'Q', 'DIV', 'SPAN', 'LI'])

const filter = node => tagSet.has(node.parentNode.tagName) && node.textContent.trim().length > 6
/**
 *
 * @param {Node} el html element
 * @return {Array}
 */
function getTextNodes(el) {
  const ret = []
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, node => (filter(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP), false)
  while (walk.nextNode()) {
    ret.push(walk.currentNode)
  }
  return ret
}

const getWords = set => text =>
  (async function getWords(set, text) {
    const regWord = /\b\w+\b/g
    let match = regWord.exec(text)
    const ret = []

    while (match) {
      const w = await getWord(match[0].toLowerCase())
      if (set.has(w)) {
        match.wk = w
        ret.push(match)
      }
      match = regWord.exec(text)
    }
    return ret
  })(set, text)

/**
 *
 * @param {*} node
 * @param {*} getWords
 * @return {Array}
 */
async function transformTextNode(node, getWords) {
  const ret = []
  const text = node.textContent
  const matchIter = await getWords(text)
  let beginIndex = 0
  for (const match of matchIter) {
    if (beginIndex != match.index) {
      ret.push(document.createTextNode(text.slice(beginIndex, match.index)))
    }
    const span = document.createElement('rw-span')
    span.setAttribute('class', 'rw-span')
    span.setAttribute('rw-wk', match.wk)
    span.textContent = match[0]
    ret.push(span)
    beginIndex = match.index + match[0].length
  }

  if (beginIndex != text.length) {
    ret.push(document.createTextNode(text.slice(beginIndex)))
  }
  return ret
}

const as = []
export const recover = () => {
  as.forEach(f => f())
  as.length = 0
}
export const effectDom = async keys => {
  if (keys.length == 0) return
  const _getWords = getWords(new Set(keys))
  for (const node of getTextNodes(document.body)) {
    const newNodes = await transformTextNode(node, _getWords)
    const pn = node.parentElement
    for (const nn of newNodes) {
      pn.insertBefore(nn, node)
    }
    pn.removeChild(node)
    as.push(() => {
      pn.insertBefore(node, newNodes[0])
      for (const nn of newNodes) {
        pn.removeChild(nn)
      }
    })
  }
}
