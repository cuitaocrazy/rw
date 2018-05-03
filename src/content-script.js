import { chget } from './words-api'
import { curry } from 'ramda'
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

const getWords = curry(function* getWords(regStr, text) {
  const regWord = new RegExp(regStr, 'gi')
  let match = regWord.exec(text)

  while (match) {
    yield match
    match = regWord.exec(text)
  }
})

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
    span.setAttribute('style', 'border: 1px solid coral')
    span.textContent = match[0]
    yield span
    beginIndex = match.index + match[0].length
  }

  if (beginIndex != text.length) {
    yield document.createTextNode(text.slice(beginIndex))
  }
}

document.addEventListener('DOMContentLoaded', function(event) {
  chget(words => {
    const _getWords = getWords('\\b' + Object.keys(words).join('\\b|\\b') + '\\b')
    for (const node of Array.from(getTextNodes(document.body))) {
      const newNodes = transformTextNode(node, _getWords)
      for (const nn of newNodes) {
        node.parentElement.insertBefore(nn, node)
      }
      node.parentElement.removeChild(node)
    }
  })

  createBubble()
})

const createBubble = () => {
  const bubble = document.createElement('div')
  bubble.setAttribute('id', 'rw-bubble')
  const word = document.createElement('div')
  bubble.setAttribute('id', 'rw-word')
  const remark = document.createElement('div')
  bubble.setAttribute('id', 'rw-remark')
  bubble.appendChild(word)
  bubble.appendChild(remark)
  document.body.appendChild(bubble)

  document.addEventListener('mousemove', evt => {
    const currentNode = document.elementFromPoint(evt.clientX, evt.clientY)
    if (currentNode.tagName === 'rw-span') {
      console.log(currentNode)
    }
  })
}
