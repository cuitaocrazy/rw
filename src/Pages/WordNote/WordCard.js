import React from 'react'
import style from './wordnode.css'
import { addOrOupdate, del } from '../../words-api'
import { gt } from '../../gt-api'
import GoogleTTS from './GoogleTTS'

export default class WordCard extends React.Component {
  constructor(props) {
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
    this.onGoogleBtnClickHandle = () => gt(props.word).then(data => this.setState({ gt: data, gtLoading: true }))
    this.onCardDelHandle = () => del(this.props.word)
  }

  makeGoogleDisplayUI(data) {
    return (
      <React.Fragment>
        <GoogleTTS word={this.props.word} />
        <ul>
          {data[1] &&
            data[1].map(ex => (
              <li key={ex[0]}>
                {ex[0]}
                <ul>{ex[1] && ex[1].map(w => <li key={w}>{w}</li>)}</ul>
              </li>
            ))}
        </ul>
      </React.Fragment>
    )
  }

  render() {
    return (
      <li className={style.card}>
        <div className={style['card-word']}>{this.props.word}</div>
        <button className={style['card-edit']} onClick={this.onEditBtnClickHandle}>
          <img src="./images/edit.png" />
        </button>
        {this.state.editing ? (
          <div>
            <form onSubmit={this.onSubmitHandle}>
              <input value={this.state.remark} autoFocus onKeyDown={this.onKeyDownHandle} onChange={this.onChangeHandle} />
            </form>
          </div>
        ) : (
          <div className={style['card-remark']}>{this.props.remark}</div>
        )}
        {this.state.gt ? (
          this.makeGoogleDisplayUI(this.state.gt)
        ) : (
          <button disabled={this.state.gtLoading} onClick={this.onGoogleBtnClickHandle}>
            google
          </button>
        )}

        <button className={style['card-del']} onClick={this.onCardDelHandle} />
      </li>
    )
  }
}
