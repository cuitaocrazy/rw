import React from 'react'
import style from './wordnote.css'
const { getTtsUrl } = require('../../msgs/background-call')

/**
 * 单词语音播放组件
 */
export default class GoogleTTS extends React.Component {
  constructor(/** @type {{word: string}} */ props) {
    super(props)
    this.state = { playing: false, url: '' }
    getTtsUrl(props.word).then(url => this.setState({ url }))
    this.onClickHandle = () => this.setState({ playing: true })
    this.onEndedHandle = () => this.setState({ playing: false })
  }

  render() {
    return (
      <div className={style['audio-bar']}>
        <span className={style.audio} disabled={this.state.playing} onClick={this.onClickHandle}>
          <img src="./images/audio.png" alt="读" title="英文发音" />
        </span>
        {this.state.playing && <audio autoPlay="true" src={this.state.url} onEnded={this.onEndedHandle} />}
      </div>
    )
  }
}
