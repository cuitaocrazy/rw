const dts = '&dt=bd'
export const gt = word =>
  new Promise((resolve, reject) =>
    chrome.runtime.sendMessage({ evtType: 'rw-tw', word, dts }, function(response) {
      resolve(response.data)
    })
  )