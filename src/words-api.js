import * as R from 'ramda'

const area = 'sync'
const key = 'words'
export const chget = cb => chrome.storage[area].get([key], result => cb(result[key] || {}))
export const chset = (words, cb) => chrome.storage[area].set({ [key]: words }, cb)
export const addOrOupdate = (word, remark) => chget(words => chset(R.assoc(word, remark)(words), () => {}))
export const del = word => chget(words => chset(R.dissoc(word)(words)))

export const onChange = fn => chrome.storage.onChanged.addListener((changes, areaName) => areaName == area && changes[key] && fn(changes[key].newValue))

export default { addOrOupdate, del, chget, chset }
