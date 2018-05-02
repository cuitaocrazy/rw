import React from 'react'
import { observer } from 'mobx-react'
import { addOrOupdate, del } from '../../words-api'
import style from './wordnode.css'

const AddWord = props => {
  let wordInput
  let remarkInput
  return (
    <form
      onSubmit={e => {
        addOrOupdate(wordInput.value, remarkInput.value)
        e.preventDefault()
      }}
    >
      <input type="text" ref={el => (wordInput = el)} />
      <input type="text" ref={el => (remarkInput = el)} />
      <input type="submit" value="添加" />
    </form>
  )
}
const WordCard = props => (
  <li className={style.card}>
    <div className={style['card-word']}>{props.word}</div>
    <button className={style['card-edit']}>
      <img src="./images/edit.png" />
    </button>
    <div className={style['card-remark']}>{props.remark}</div>
    <button className={style['card-del']} onClick={() => del(props.word)} />
  </li>
)

const Filter = props => (
  <div className={style['filter-content']}>
    <input type="text" className={style['filter-control']} value={props.prefix} onChange={evt => (props.prefix = evt.target.value)} />
  </div>
)

const createWordCards = words => Object.keys(words).map(word => <WordCard key={word} word={word} remark={words[word]} />)

export default observer(props => (
  <div className={style['cards']}>
    <AddWord />
    <Filter prefix="" />
    <ol>{createWordCards(props.wordsStore.words)}</ol>
  </div>
))
