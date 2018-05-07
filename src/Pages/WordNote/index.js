import React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import { addOrOupdate } from '../../words-api'
import style from './wordnode.css'
import { pick, keys, filter, chain, compose } from 'ramda'
import WordCard from './WordCard'

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

const createWordCards = words => Object.keys(words).map(word => <WordCard key={word} word={word} remark={words[word]} />)

const filterKeyword = observable.box('')
export default observer(props => {
  return (
    <div className={style['cards']}>
      <AddWord />
      <Filter prefix={filterKeyword} />
      <ol>{createWordCards(chain(pick)(compose(filter(v => v.indexOf(filterKeyword.get()) != -1), keys))(props.wordsStore.words))}</ol>
    </div>
  )
})
