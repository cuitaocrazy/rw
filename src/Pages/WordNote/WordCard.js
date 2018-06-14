import React from 'react'
import style from './wordnote.css'
import { addOrOupdate, del } from '../../words-api'
import { translateWord } from '../../msgs/background-call'
import GoogleTTS from './GoogleTTS'

/**
 * 单词卡组件
 */
export default class WordCard extends React.Component {
  constructor(/** @type {{word: string, remark: string}} */ props) {
    super(props)
    this.state = { editing: false, remark: props.remark, gt: undefined, gtLoading: false }
    this.onSubmitHandle = evt => {
      if (this.props.remark != this.state.remark) {
        addOrOupdate(this.props.word, this.state.remark.trim())
      }
      this.setState({ editing: false })
      evt.preventDefault()
    }
    this.onEditBtnClickHandle = () => this.setState({ editing: !this.state.editing })
    this.onKeyDownHandle = evt => evt.keyCode == 27 && this.setState({ editing: false, remark: props.remark })
    this.onChangeHandle = evt => this.setState({ remark: evt.target.value })
    this.onGoogleBtnClickHandle = () => translateWord(props.word).then(data => this.setState({ gt: data, gtLoading: true }))
    this.onCardDelHandle = () => del(this.props.word)
  }

  /**
   *
   * @param {any[]} data
   * @return {JSX.Element} Google翻译显示UI
   */
  makeGoogleDisplayUI(data) {
    return (
      <React.Fragment>
        <GoogleTTS word={this.props.word} />
        <ul className={style['rw-ul']}>
          {data[1] &&
            data[1].map(ex => (
              <li key={ex[0]}>
                {ex[0]}
                <ul className={style['rw-ul']}>{ex[1] && ex[1].map(w => <li key={w}>{w}</li>)}</ul>
              </li>
            ))}
        </ul>
      </React.Fragment>
    )
  }

  /**
   * 渲染函数
   *
   * @return {JSX.Element}
   */
  render() {
    return (
      <li className={style.card}>
        <div className={style['card-word']}>{this.props.word}</div>
        <button className={style['card-edit']} onClick={this.onEditBtnClickHandle}>
          <img src="./images/edit.png" title="编辑中文" />
        </button>
        {this.state.gt ? (
          this.makeGoogleDisplayUI(this.state.gt)
        ) : (
          <button className={style['btn-icon']} disabled={this.state.gtLoading} onClick={this.onGoogleBtnClickHandle}>
            <img src="./images/google.png" title="谷歌翻译" />
          </button>
        )}
        {this.state.editing ? (
          <form className={style['rw-form']} onSubmit={this.onSubmitHandle}>
            <input className={style['card-remark']} value={this.state.remark} autoFocus onKeyDown={this.onKeyDownHandle} onChange={this.onChangeHandle} />
          </form>
        ) : (
          <div className={style['card-remark']}>{this.props.remark}</div>
        )}

        <button className={style['card-del']} onClick={this.onCardDelHandle} />
      </li>
    )
  }
}
