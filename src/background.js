const tk = require('./tk')

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

const makeUrl = (word, tk, dts) => 'https://translate.google.cn/translate_a/single?client=t&sl=en&tl=zh-CN&hl=zh-CN' + dts + tk + '&q=' + word

const cache = {}
const p = fetch(chrome.extension.getURL('eng_dict.dat'))
  .then(res => res.text())
  .then(s => s.split('\n'))
  .then(as => as.map(line => line.split('\t')))
  .then(as => new Map(as))

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.evtType == 'rw-tw') {
    if (cache[request.word]) {
      sendResponse({ data: cache[request.word] })
    } else {
      getTkk()
        .then(tkk => {
          const url = makeUrl(request.word, tk(request.word, tkk), request.dts)
          return fetch(url).then(res => res.json())
        })
        .then(json => {
          cache[request.word] = json
          sendResponse({ data: json })
        })
      return true
    }
  } else if (request.evtType == 'rw-dict') {
    p.then(dict => sendResponse({ word: dict.get(request.word) || request.word }))
    return true
  }
})
