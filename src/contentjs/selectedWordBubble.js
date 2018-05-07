import { effectDom } from './effectDom'
import { chget, chset } from '../words-api'
const as = []

export const clear = () => {
  as.forEach(f => f())
  as.length = 0
}

export const createBubble = () => {
  const container = document.createElement('div')
  container.setAttribute('id', 'rw-add-word-bubble')
  container.setAttribute('style', 'visibility: hidden')
  const btn = document.createElement('div')
  btn.setAttribute('id', 'rw-add-word-bubble-btn')

  container.appendChild(btn)
  document.body.appendChild(container)

  const mouseupHandle = evt => {
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
  }
  document.addEventListener('mouseup', mouseupHandle)

  as.push(() => document.body.removeChild(container))
  as.push(() => document.removeEventListener('mouseup', mouseupHandle))
}

export default { createBubble, clear }