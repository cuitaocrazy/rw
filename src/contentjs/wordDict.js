export const getWord = word =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ evtType: 'rw-dict', word }, function(response) {
      resolve(response.word)
    })
  })
