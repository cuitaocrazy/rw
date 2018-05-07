import { chget, chset } from './words-api'
import { effectDom, recover } from './contentjs/effectDom'
import wordBubble from './contentjs/wordBubble'

let v = false

document.addEventListener('DOMContentLoaded', function(event) {
  chget(words => {
    createAddWordBubble()
    const keys = Object.keys(words)
    effectDom(keys)
    v = true

    wordBubble.createBubble(words)
  })
})

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
                chset(words, () => {
                  effectDom([selectedText])
                })
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

chrome.runtime.onMessage.addListener((req, sender, sendResp) => {
  if (req.evtType == 'rw-change') {
    if (v) {
      recover()
      v = false
    } else {
      chget(words => {
        const keys = Object.keys(words)
        if (keys.length == 0) {
          return
        }
        effectDom(keys)
        v = true
      })
    }
  }
})
