import React from 'react'
import style from './wordnode.css'
import { addOrOupdate, del } from '../../words-api'

/**
 *
 */
export default class WordCard extends React.Component {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super(props)
    this.state = { editing: false, remark: props.remark }
    this.setEditing = editing => this.setState({ editing })
    this.setRemark = remark => this.setState({ remark })
    this.reset = () => this.setState({ editing: false, remark: props.remark })
  }

  /**
   * @return {*}
   */
  render() {
    return (
      <li className={style.card}>
        <div className={style['card-word']}>{this.props.word}</div>
        <button className={style['card-edit']} onClick={() => this.setEditing(!this.state.editing)}>
          <img src="./images/edit.png" />
        </button>
        {this.state.editing ? (
          <div>
            <form
              onSubmit={evt => {
                evt.preventDefault()
                if (this.props.remark != this.state.remark) {
                  addOrOupdate(this.props.word, this.state.remark)
                }
                this.setEditing(false)
              }}
            >
              <input
                value={this.state.remark}
                autoFocus
                onKeyDown={evt => evt.keyCode == 27 && this.reset()}
                onChange={evt => this.setRemark(evt.target.value)}
              />
            </form>
          </div>
        ) : (
          <div className={style['card-remark']}>{this.props.remark}</div>
        )}

        <button className={style['card-del']} onClick={() => del(this.props.word)} />
      </li>
    )
  }
}
