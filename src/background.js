const tk = require('./tk')

const regex = /TKK=eval\(\'(.*?)\'\)/ // eslint-disable-line

/**
 * @return {Promise} p
 */
function updateTkk() {
  return fetch('https://translate.google.cn/')
    .then(res => res.text())
    .then(txt => regex.exec(txt)[1])
    .then(js => eval(eval('"' + js + '"')))
    .then(
      tkk => new Promise((resolve, reject) => chrome.storage.local.set({ tkk: { key: tkk, timestamp: Math.floor(Date.now() / 3600000) } }, () => resolve(tkk)))
    )
}

/**
 * @return {Promise} p
 */
function checkTkk() {
  return new Promise((resolve, reject) => {
    const up = () =>
      updateTkk()
        .then(resolve)
        .catch(reject)
    chrome.storage.local.get(['tkk'], result => {
      if (result.tkk) {
        const now = Math.floor(Date.now() / 3600000)
        if (result.tkk.timestamp != now) {
          up()
        } else {
          resolve(result.tkk.key)
        }
      } else {
        up()
      }
    })
  })
}

checkTkk()

const makeUrl = (word, tk, dts) => 'https://translate.google.cn/translate_a/single?client=t&sl=en&tl=zh-CN&hl=zh-CN' + dts + tk + '&q=' + word

const cache = {}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.evtType == 'rw-tw') {
    if (cache[request.word]) {
      sendResponse({ data: cache[request.word] })
    } else {
      checkTkk()
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
    sendResponse({ word: dict.get(request.word) || request.word })
  }
})

let dict

fetch(chrome.extension.getURL('eng_dict.txt'))
  .then(res => res.text())
  .then(s => s.split('\n'))
  .then(as => as.map(line => line.split('\t')))
  .then(as => new Map(as))
  .then(map => (dict = map))
