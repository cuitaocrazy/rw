import { TRANSLATE_WORD, GET_TTS_URL, CONVERT_TO_BASE_WORD } from './background-evt-type'
const dts = '&dt=bd&dt=t'

/**
 *
 * @param {chrome.tabs.QueryInfo} queryInfo
 * @return {Promise<chrome.tabs.Tab[]>}
 */
export const tabQuery = queryInfo => new Promise(resolve => chrome.tabs.query(queryInfo, resolve))

/**
 *
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
/**
 * 翻译单词
 * @param {string} word 单词
 *
 * @return {Promise<any[]>} 单词翻译
 */
export const translateWord = word => sendMessage({ evtType: TRANSLATE_WORD, word, dts }).then(res => res.data)
/**
 *  获取单词发音的URL
 * @param {string} word 单词
 *
 * @return {Promise<string>} tts url
 */
export const getTtsUrl = word => sendMessage({ evtType: GET_TTS_URL, word }).then(res => res.url)
/**
 * 把单词转换成原词
 * @param {string} word 单词
 * @return {Promise<string>} 原词
 */
export const convertToBaseWord = word => sendMessage({ evtType: CONVERT_TO_BASE_WORD, word }).then(res => res.word)
