// eslint-disable-next-line
/**
 * 查询数据
 * @param {string} area
 * @return {(keys: string[]) => Promise<{[key: string]: any}>}
 */
export const chget = area => keys => new Promise(resolve => chrome.storage[area].get(keys, resolve))

// eslint-disable-next-line
/**
 * 获取数据
 * @param {string} area
 * @return {(kvs: {[key: string]: any}) => Promise<void>}
 */
export const chset = area => kvs => new Promise(resolve => chrome.storage[area].set(kvs, resolve))

/**
 * Tab查询
 * @param {chrome.tabs.QueryInfo} queryInfo
 * @return {Promise<chrome.tabs.Tab[]>}
 */
export const tabQuery = queryInfo => new Promise(resolve => chrome.tabs.query(queryInfo, resolve))

/**
 * 发送消息到Tab
 * @param {number} id
 * @param {*} msg
 * @return {Promise<any>}
 */
export const sendMessageToTab = (id, msg) => new Promise(resolve => chrome.tabs.sendMessage(id, msg, resolve))

/**
 * 向chrome发送消息
 * @param {any} msg 消息
 * @return {Promise<any>} 响应
 */
export const sendMessage = msg => new Promise(resolve => chrome.runtime.sendMessage(msg, resolve))
