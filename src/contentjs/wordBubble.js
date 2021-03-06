import { translateWord, playTts } from '../msgs/background-call'

const as = []
export const clear = () => {
  as.forEach(f => f())
  as.length = 0
}

export const createBubble = words => {
  const bubble = document.createElement('div')
  bubble.setAttribute('id', 'rw-bubble')
  bubble.setAttribute('style', 'visibility: hidden')
  const word = document.createElement('div')
  word.setAttribute('id', 'rw-word')
  const tts = document.createElement('div')
  // const audioPlayBtn = document.createElement('div')
  // audioPlayBtn.textContent = 'pl'
  // const audio = document.createElement('audio')
  // tts.appendChild(audioPlayBtn)
  // tts.appendChild(audio)
  // audioPlayBtn.addEventListener('click', () => {
  //   // audio.currentTime = 0
  //   // audio.paused && audio.play()
  // })

  const remark = document.createElement('div')
  remark.setAttribute('id', 'rw-remark')
  const gtEl = document.createElement('div')
  gtEl.setAttribute('id', 'rw-gtEl')
  bubble.appendChild(word)
  bubble.appendChild(tts)
  bubble.appendChild(remark)
  bubble.appendChild(gtEl)
  document.body.appendChild(bubble)

  const isBubble = el => (el ? el.id === 'rw-bubble' || isBubble(el.parentElement) : false)

  const mousemoveHandle = evt => {
    const currentNode = document.elementFromPoint(evt.clientX, evt.clientY)
    currentNode.parentElement
    if (currentNode && currentNode.tagName === 'RW-SPAN') {
      if (window.getComputedStyle(bubble).visibility === 'hidden') {
        const key = currentNode.getAttribute('rw-wk')
        word.textContent = key
        remark.textContent = words[key]
        const rect = currentNode.getBoundingClientRect()
        bubble.style.top = rect.bottom + 'px'
        bubble.style.left = Math.max(5, Math.floor(rect.left)) + 'px'
        bubble.classList.add('rw-show')
        gtEl.textContent = ''

        tts.innerHTML = ''
        const ttsBtn = document.createElement('div')
        ttsBtn.textContent = 'pl'
        tts.appendChild(ttsBtn)
        tts.addEventListener('click', () => playTts(key))
        // getTtsUrl(key).then(url => (audio.src = url))
        translateWord(key).then(data => {
          if (window.getComputedStyle(bubble).visibility !== 'hidden') {
            const explanations = data[1]
            if (!explanations) {
              return
            }
            const root = document.createElement('ul')
            root.classList.add('rw-ul')
            explanations.forEach(exp => {
              const li = document.createElement('li')
              li.textContent = exp[0]
              const ul = document.createElement('ul')
              li.appendChild(ul)
              root.appendChild(li)
              exp[1].forEach(tw => {
                const twLi = document.createElement('li')
                twLi.textContent = tw
                ul.appendChild(twLi)
              })
            })
            gtEl.appendChild(root)
          }
        })
      }
    } else if (!isBubble(currentNode)) {
      bubble.classList.remove('rw-show')
    }
  }

  const scrollHandle = () => bubble.classList.remove('rw-show')

  document.addEventListener('mousemove', mousemoveHandle)

  window.addEventListener('scroll', scrollHandle)

  as.push(() => document.body.removeChild(bubble))
  as.push(() => document.removeEventListener('mousemove', mousemoveHandle))
  as.push(() => window.removeEventListener('scroll', scrollHandle))
}

export default {
  createBubble,
  clear,
}
