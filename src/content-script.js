import { chget } from './words-api'
import { effectDom, recover } from './contentjs/effectDom'
import wordBubble from './contentjs/wordBubble'
import selectedWordBubble from './contentjs/selectedWordBubble'

let v = false

const init = () => {
  chget(words => {
    selectedWordBubble.createBubble()
    const keys = Object.keys(words)
    effectDom(keys)
    v = true
    wordBubble.createBubble(words)
  })
}

const destroy = () => {
  recover()
  wordBubble.clear()
  selectedWordBubble.clear()
  v = false
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['defaultDisable'], result => !result['defaultDisable'] && init())
})

chrome.runtime.onMessage.addListener((req, sender, sendResp) => {
  if (req.evtType == 'rw-change-status') {
    if (v) {
      destroy()
    } else {
      init()
    }
  } else if (req.evtType == 'tw-get-status') {
    sendResp({ disable: v })
  }
})
