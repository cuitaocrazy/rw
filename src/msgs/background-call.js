import { TRANSLATE_WORD, GET_TTS_URL, CONVERT_TO_BASE_WORD, PLAY_TTS } from './evt-type'
import { sendMessage } from '../chrome-api'
const dts = '&dt=bd&dt=t'

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

/**
 * 播放单词的tts
 *
 * @param {string} word
 * @return {Promise<void>}
 */
export const playTts = word => sendMessage({ evtType: PLAY_TTS, word })
