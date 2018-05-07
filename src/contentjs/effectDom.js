const tagSet = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'B', 'SMALL', 'STRONG', 'Q', 'DIV', 'SPAN', 'LI'])

const filter = node => tagSet.has(node.parentNode.tagName) && node.textContent.trim().length > 6
/**
 *
 * @param {Node} el html element
 */
function* getTextNodes(el) {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, node => (filter(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP), false)
  while (walk.nextNode()) {
    yield walk.currentNode
  }
}

const getWords = regStr => text =>
  (function* getWords(regStr, text) {
    const regWord = new RegExp(regStr, 'gi')
    let match = regWord.exec(text)

    while (match) {
      yield match
      match = regWord.exec(text)
    }
  })(regStr, text)

/**
 *
 * @param {*} node
 * @param {*} getWords
 */
function* transformTextNode(node, getWords) {
  const text = node.textContent
  const matchIter = getWords(text)
  let beginIndex = 0
  for (const match of matchIter) {
    if (beginIndex != match.index) {
      yield document.createTextNode(text.slice(beginIndex, match.index))
    }
    const span = document.createElement('rw-span')
    span.setAttribute('class', 'rw-span')
    span.textContent = match[0]
    yield span
    beginIndex = match.index + match[0].length
  }

  if (beginIndex != text.length) {
    yield document.createTextNode(text.slice(beginIndex))
  }
}

const as = []
export const recover = () => {
  as.forEach(f => f())
  as.length = 0
}
export const effectDom = keys => {
  if (keys.length == 0) return
  const _getWords = getWords('\\b' + keys.join('\\b|\\b') + '\\b')
  for (const node of Array.from(getTextNodes(document.body))) {
    const newNodes = Array.from(transformTextNode(node, _getWords))
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
