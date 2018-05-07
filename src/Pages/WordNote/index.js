import React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { addOrOupdate, del } from '../../words-api'
import style from './wordnode.css'
import { pick, keys, filter, chain, compose } from 'ramda'

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
              if (props.cardState.remark != inputRef.value) {
                addOrOupdate(props.cardState.word, inputRef.value)
              } else {
                props.cardState.isEdit = false
              }
            }}
          >
            <input
              defaultValue={props.cardState.remark}
              ref={ele => (inputRef = ele)}
              autoFocus
              onKeyDown={evt => evt.keyCode == 27 && (props.cardState.isEdit = false)}
            />
          </form>
        </div>
      ) : (
        <div className={style['card-remark']}>{props.cardState.remark}</div>
      )}

      <button className={style['card-del']} onClick={() => del(props.cardState.word)} />
    </li>
  )
})

const Filter = observer(props => (
  <div className={style['filter-content']}>
    <input
      type="text"
      className={style['filter-control']}
      value={props.prefix.get()}
      onChange={evt => props.prefix.set(evt.target.value)}
      placeholder="快速查找"
    />
    <img className={style['filter-icon']} src="./images/search.png" />
  </div>
))

const createWordCards = words =>
  Object.keys(words).map(word => <WordCard key={word} cardState={observable({ isEdit: false, word: word, remark: words[word] })} />)

const prefix = observable.box('')
export default observer(props => {
  return (
    <div className={style['cards']}>
      <AddWord />
      <Filter prefix={prefix} />
      <ol>{createWordCards(chain(pick)(compose(filter(v => v.indexOf(prefix.get()) != -1), keys))(props.wordsStore.words))}</ol>
    </div>
  )
})
