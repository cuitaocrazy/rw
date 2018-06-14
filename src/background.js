const mtk = require('./tk')
const { TRANSLATE_WORD, GET_TTS_URL, CONVERT_TO_BASE_WORD } = require('./msgs/evt-type')

const regex = /TKK=eval\(\'(.*?)\'\)/ // eslint-disable-line

const chget = keys => new Promise((resolve, reject) => chrome.storage.local.get(keys, resolve))
const chset = obj => new Promise((resolve, reject) => chrome.storage.local.set(obj, resolve))

async function saveTkk(tkk) {
  await chset({ tkk: { key: tkk, timestamp: Math.floor(Date.now() / 3600000) } })
}

function atomPromiseFunc(fn) {
  let p = Promise.resolve()
  return function(...args) {
    return (p = p.then(() => fn(...args)))
  }
}

async function _getTkk() {
  const tkk = (await chget(['tkk'])).tkk
  if (tkk && tkk.timestamp == Math.floor(Date.now() / 3600000)) {
    return tkk.key
  } else {
    const res = await fetch('https://translate.google.cn/')
    const txt = await res.text()
    const js = regex.exec(txt)[1]
    const key = eval(eval('"' + js + '"'))
    saveTkk(key)
    return key
  }
}

const getTkk = atomPromiseFunc(_getTkk)

getTkk()

const makeGtUrl = (word, tk, dts) => 'https://translate.google.cn/translate_a/single?client=t&sl=en&tl=zh-CN&hl=zh-CN' + dts + tk + '&q=' + word

const cache = {}
const p = fetch(chrome.extension.getURL('eng_dict.txt'))
  .then(res => res.text())
  .then(s => (s.indexOf('\r') === -1 ? s.split('\n') : s.split('\r\n')))
  .then(as => as.map(line => line.split('\t')))
  .then(as => new Map(as))

const makeGttsUrl = (word, tk) =>
  'https://translate.google.cn/translate_tts?ie=UTF-8&q=' + word + '&tl=en&total=1&idx=0&textlen=' + word.length + tk + '&client=t&prev=input'

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.evtType == TRANSLATE_WORD) {
    if (cache[request.word]) {
      sendResponse({ data: cache[request.word] })
    } else {
      getTkk()
        .then(tkk => {
          const url = makeGtUrl(request.word, mtk(request.word, tkk), request.dts)
          return fetch(url).then(res => res.json())
        })
        .then(json => {
          cache[request.word] = json
          sendResponse({ data: json })
        })
      return true
    }
  } else if (request.evtType == CONVERT_TO_BASE_WORD) {
    p.then(dict => sendResponse({ word: dict.get(request.word) || request.word }))
    return true
  } else if (request.evtType == GET_TTS_URL) {
    getTkk().then(tkk => sendResponse({ url: makeGttsUrl(request.word, mtk(request.word, tkk)) }))
    return true
  }
})
