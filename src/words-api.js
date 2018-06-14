import * as R from 'ramda'
import { chget, chset } from './chrome-api'

const area = 'sync'
const key = 'words'
const chgetArea = chget(area)
const chsetArea = chset(area)

// eslint-disable-next-line
/**
 * 获取单词本
 *
 * @return {Promise<{[key: string]: string}>}
 */
export const getWords = () => chgetArea([key]).then(result => result[key] || {})

// eslint-disable-next-line
/**
 *
 * @param {{[key: string]: string}} words
 * @return {Promise<void>}
 */
export const setWords = words => chsetArea(words)

/**
 *
 * @param {string} word
 * @param {string} remark
 * @return {Promise<void>}
 */
export const addOrOupdateWord = (word, remark) =>
  getWords().then(
    R.compose(
      R.assoc(word, remark),
      setWords
    )
  )

/**
 *
 * @param {string} word
 * @return {Promise<void>}
 */
export const delWord = word =>
  getWords().then(
    R.compose(
      R.dissoc(word),
      setWords
    )
  )

// eslint-disable-next-line
/**
 * 添加单词本变化事件
 * @param {(words: {[key:string]: string}) => void} fn
 * @return {Function} 清理函数
 */
export const onChange = fn => {
  const listener = (changes, areaName) => areaName == area && changes[key] && fn(changes[key].newValue)
  chrome.storage.onChanged.addListener(listener)
  return () => chrome.storage.onChanged.removeListener(listener)
}

export default { addOrOupdateWord, delWord, getWords, setWords }
