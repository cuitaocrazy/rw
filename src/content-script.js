import { chget } from './words-api'
import { effectDom, recover } from './contentjs/effectDom'
import wordBubble from './contentjs/wordBubble'
import selectedWordBubble from './contentjs/selectedWordBubble'

let v = true

function atomPromiseFunc(fn) {
  let p = Promise.resolve()
  return function(...args) {
    return (p = p.then(() => fn(...args)))
  }
}
const pchget = () => new Promise((resolve, reject) => chget(resolve))

async function init() {
  const words = await pchget()
  selectedWordBubble.createBubble()
  const keys = Object.keys(words)
  await effectDom(keys)
  wordBubble.createBubble(words)
  v = false
}

const destroy = () => {
  recover()
  wordBubble.clear()
  selectedWordBubble.clear()
  v = true
}

const rwSwitch = atomPromiseFunc(async () => {
  if (!v) {
    destroy()
  } else {
    await init()
  }
})

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['defaultDisable'], result => !result['defaultDisable'] && rwSwitch())
})

chrome.runtime.onMessage.addListener((req, sender, sendResp) => {
  if (req.evtType == 'rw-change-status') {
    rwSwitch()
      .then(() => sendResp('ok'))
      .catch(() => {})
    return true
  } else if (req.evtType == 'tw-get-status') {
    sendResp({ disable: v })
  }
})
