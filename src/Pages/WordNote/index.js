import React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { addOrOupdate, del } from '../../words-api'
import style from './wordnode.css'

const AddWord = props => {
  let wordInput
  let remarkInput
  return (
    <form
      className={style.form}
      onSubmit={e => {
        addOrOupdate(wordInput.value, remarkInput.value)
        e.preventDefault()
      }}
    >
      <div className={style['input-en']}>
        <input type="text" ref={el => (wordInput = el)} placeholder=" " />
        <span>English words</span>
      </div>
      <div className={style['input-ch']}>
        <input type="text" ref={el => (remarkInput = el)} placeholder=" " />
        <span>中文翻译</span>
        <input className={style['create-card']} type="submit" value="添加" />
      </div>
    </form>
  )
}
const WordCard = observer(props => {
  let inputRef
  return (
    <li className={style.card}>
      <div className={style['card-word']}>{props.cardState.word}</div>
      <button className={style['card-edit']} onClick={() => (props.cardState.isEdit = !props.cardState.isEdit)}>
        <img src="./images/edit.png" />
      </button>
      {props.cardState.isEdit ? (
        <div>
          <form
            onSubmit={evt => {
              evt.preventDefault()
              addOrOupdate(props.cardState.word, inputRef.value)
            }}
          >
            <input defaultValue={props.cardState.remark} ref={ele => (inputRef = ele)} autoFocus />
          </form>
        </div>
      ) : (
        <div className={style['card-remark']}>{props.cardState.remark}</div>
      )}

      <button className={style['card-del']} onClick={() => del(props.word)} />
    </li>
  )
})

const Filter = props => (
  <div className={style['filter-content']}>
    <input type="text" className={style['filter-control']} value={props.prefix} onChange={evt => (props.prefix = evt.target.value)} placeholder="快速查找" />
    <img className={style['filter-icon']} src="./images/search.png" />
  </div>
)

const createWordCards = words =>
  Object.keys(words).map(word => <WordCard key={word} cardState={observable({ isEdit: false, word: word, remark: words[word] })} />)

export default observer(props => (
  <div className={style['cards']}>
    <AddWord />
    <Filter prefix="" />
    <ol>{createWordCards(props.wordsStore.words)}</ol>
  </div>
))
