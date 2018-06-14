import { getWords } from './words-api'
import { effectDom, recover } from './contentjs/effectDom'
import wordBubble from './contentjs/wordBubble'
import selectedWordBubble from './contentjs/selectedWordBubble'
import { ENABLE_TAB_RW, DISABLE_TAB_RW, GET_TAB_STATUS } from './msgs/evt-type'

function atomPromiseFunc(fn) {
  let p = Promise.resolve()
  return function(...args) {
    return (p = p.then(() => fn(...args)))
  }
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['defaultDisable'], ({ defaultDisable: disableFlag }) => {
    async function enable() {
      const words = await getWords()
      selectedWordBubble.createBubble()
      const keys = Object.keys(words)
      await effectDom(keys)
      wordBubble.createBubble(words)
    }
    const disable = () => {
      recover()
      wordBubble.clear()
      selectedWordBubble.clear()
    }

    const atomCall = atomPromiseFunc(func => func())
    atomCall(disableFlag ? disable : enable)

    chrome.runtime.onMessage.addListener((req, sender, sendResp) => {
      if (req.evtType == GET_TAB_STATUS) {
        sendResp(disableFlag)
      } else if (req.evtType == ENABLE_TAB_RW && disableFlag) {
        atomCall(enable).then(() => sendResp('ok'))
        disableFlag = false
        return true
      } else if (req.evtType == DISABLE_TAB_RW && !disableFlag) {
        atomCall(disable).then(() => sendResp('ok'))
        disableFlag = true
        return true
      }
    })
  })
})
