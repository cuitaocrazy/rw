import { chget, chset } from './words-api'
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
    span.setAttribute('class', 'rw-span')
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
    createAddWordBubble()
    const keys = Object.keys(words)
    if (keys.length == 0) {
      return
    }
    const _getWords = getWords('\\b' + keys.join('\\b|\\b') + '\\b')
    for (const node of Array.from(getTextNodes(document.body))) {
      const newNodes = transformTextNode(node, _getWords)
      for (const nn of newNodes) {
        node.parentElement.insertBefore(nn, node)
      }
      node.parentElement.removeChild(node)
    }

    createBubble(words)
  })
})

const createBubble = words => {
  const bubble = document.createElement('div')
  bubble.setAttribute('id', 'rw-bubble')
  bubble.setAttribute('style', 'visibility: hidden')
  const word = document.createElement('div')
  word.setAttribute('id', 'rw-word')
  const remark = document.createElement('div')
  remark.setAttribute('id', 'rw-remark')
  bubble.appendChild(word)
  bubble.appendChild(remark)
  document.body.appendChild(bubble)

  document.addEventListener('mousemove', evt => {
    const currentNode = document.elementFromPoint(evt.clientX, evt.clientY)
    if (currentNode.tagName === 'RW-SPAN') {
      if (bubble.style.visibility === 'hidden') {
        const key = currentNode.textContent.toLowerCase()
        word.textContent = key
        remark.textContent = words[key]
        const rect = currentNode.getBoundingClientRect()
        bubble.style.top = rect.bottom + 'px'
        bubble.style.left = Math.max(5, Math.floor(rect.left)) + 'px'
        bubble.classList.add('rw-show')
      }
    } else {
      bubble.classList.remove('rw-show')
    }
  })

  window.addEventListener('scroll', () => bubble.classList.remove('rw-show'))
}

const createAddWordBubble = () => {
  const container = document.createElement('div')
  container.setAttribute('id', 'rw-add-word-bubble')
  container.setAttribute('style', 'visibility: hidden')
  const btn = document.createElement('div')
  btn.setAttribute('id', 'rw-add-word-bubble-btn')

  container.appendChild(btn)
  document.body.appendChild(container)

  document.addEventListener('mouseup', evt => {
    setTimeout(() => {
      const calcLoc = () => {
        const gtx = document.getElementById('gtx-trans')

        if (gtx) {
          const rect = gtx.getBoundingClientRect()
          return {
            top: rect.top + 'px',
            left: rect.left + rect.width + 'px',
          }
        } else {
          return {
            top: evt.clientY + 'px',
            left: evt.clientX + 'px',
          }
        }
      }
      const selectedText = window
        .getSelection()
        .toString()
        .trim()

      if (selectedText && /^\b\w+\b$/.test(selectedText)) {
        if (container.style.visibility === 'hidden') {
          container.style.visibility = 'visible'
          const loc = calcLoc()
          container.style.top = loc.top
          container.style.left = loc.left

          btn.addEventListener(
            'click',
            () => {
              chget(words => {
                words[selectedText.toLowerCase()] = selectedText
                chset(words, () => {})
              })
            },
            true
          )
        }
      } else {
        container.style.visibility = 'hidden'
      }
    }, 10)
  })
}

// document.addEventListener('selectionchange', e => {
//   const selection = window.getSelection()
//   console.log(selection)
//   console.log(selection.toString())
//   // console.log(selection.focusNode.textContent.slice(selection.anchorOffset, selection.extentOffset))
// })
