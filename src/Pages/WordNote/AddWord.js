import React from 'react'
import { addOrOupdateWord } from '../../words-api'
import style from './wordnote.css'

/**
 * 添加单词组件
 */
export default class AddWord extends React.Component {
  constructor() {
    super()
    this.state = { word: '', remark: '' }
    this.onWordChangeHandle = evt => this.setState({ word: evt.target.value })
    this.onRemarkChangeHandle = evt => this.setState({ remark: evt.target.value })
    this.onSubmitHandle = evt => {
      const word = this.state.word.trim().toLowerCase()
      const remark = this.state.remark.trim()
      if (word) {
        addOrOupdateWord(word, remark)
        this.setState({ word: '', remark: '' })
      }
      evt.preventDefault()
    }
  }

  render() {
    return (
      <form className={style.form} onSubmit={this.onSubmitHandle}>
        <div className={style['input-en']}>
          <input type="text" value={this.state.word} placeholder=" " onChange={this.onWordChangeHandle} />
          <span>English words</span>
        </div>
        <div className={style['input-ch']}>
          <input type="text" value={this.state.remark} placeholder=" " onChange={this.onRemarkChangeHandle} />
          <span>中文翻译</span>
          <input className={style['create-card']} type="submit" value="添加" />
        </div>
      </form>
    )
  }
}
