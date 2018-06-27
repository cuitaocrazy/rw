import React from 'react'
import style from './wordnote.css'
const { playTts } = require('../../msgs/background-call')

/**
 * 单词语音播放组件
 * @return {JSX.Element}
 */
export default ({ word }) => (
  <div className={style['audio-bar']}>
    <span className={style.audio} onClick={() => playTts(word)}>
      <img src="./images/audio.png" alt="读" title="英文发音" />
    </span>
  </div>
)
