import React from 'react'
import { connect } from 'react-redux'
import { addOrUpdate, del } from '../../actions'
import style from './wordnode.css'

const WordCard = props => (
  <li className={style.card}>
    <div className={style['card-word']}>{props.word}</div>
    <div className={style['card-remark']}>{props.remark}</div>
    <div className={style['card-operation']}>
      <button className={style['card-edit']}>
        <img src="./images/edit.png" />
      </button>
      <button className={style['card-del']} onClick={props.del}>
        <img src="./images/remove.png" />
      </button>
    </div>
  </li>
)

const Filter = props => (
  <div className={style['filter-content']}>
    <input type="text" className={style['filter-control']} value={props.prefix} onChange={evt => (props.prefix = evt.target.value)} />
  </div>
)

const createWordCards = props =>
  Object.keys(props.words).map(word => <WordCard key={word} word={word} remark={props.words[word]} del={() => props.del(word)} />)

export default connect(state => ({ words: state }), { addOrUpdate, del })(props => (
  <div className={style['cards']}>
    <Filter prefix="" />
    <ol>{createWordCards(props)}</ol>
  </div>
))
