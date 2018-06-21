// eslint-disable-next-line
/**
 * 获取本地数据
 *
 * @param {string[]} keys
 * @return {Promise<{[key: string]: any}>}
 */
export const chgetL = keys => new Promise(resolve => chrome.storage.local.get(keys, resolve))

// eslint-disable-next-line
/**
 * 存储本地数据
 *
 * @param {{[key: string]: any}} kvs
 * @return {Promise<void>}
 */
export const chsetL = kvs => new Promise(resolve => chrome.storage.local.set(kvs, resolve))

// eslint-disable-next-line
/**
 * 获取Google用户数据
 *
 * @param {string[]} keys
 * @return {Promise<{[key: string]: any}>}
 */
export const chgetS = keys => new Promise(resolve => chrome.storage.sync.get(keys, resolve))

// eslint-disable-next-line
/**
 * 存储Google用户数据
 *
 * @param {{[key: string]: any}} kvs
 * @return {Promise<void>}
 */
export const chsetS = kvs => new Promise(resolve => chrome.storage.sync.set(kvs, resolve))

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
