import React from 'react'
const tk = require('../../tk')

let tkk
chrome.storage.local.get(['tkk'], result => {
  tkk = result.tkk.key
})
export default class GoogleTTS extends React.Component {
  constructor(props) {
    super(props)
    const k = tk(props.word, tkk)
    const url =
      'https://translate.google.cn/translate_tts?ie=UTF-8&q=' + props.word + '&tl=en&total=1&idx=0&textlen=' + props.word.length + k + '&client=t&prev=input'
    this.state = { playing: false, url }
    this.onClickHandle = () => this.setState({ playing: true })
    this.onEndedHandle = () => this.setState({ playing: false })
  }

  render() {
    return (
      <div>
        <button disabled={this.state.playing} onClick={this.onClickHandle}>
          播放
        </button>
        {this.state.playing && <audio autoPlay="true" src={this.state.url} onEnded={this.onEndedHandle} />}
      </div>
    )
  }
}