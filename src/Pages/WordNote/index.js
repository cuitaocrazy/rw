import React from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import style from './wordnote.css'
import { pick, keys, filter, chain, compose } from 'ramda'
import WordCard from './WordCard'
import AddWord from './AddWord'

/**
 * 过滤器组件
 */
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

/**
 * @typedef FilterProps
 * @property {string} prefix
 * @property {(newPrefix: string) => void} onChange
 */

/**
 *
 * @param {FilterProps} props
 * @return {JSX.Element}
 */
export const Filter1 = props => (
  <div className={style['filter-content']}>
    <input
      type="text"
      className={style['filter-control']}
      value={props.prefix.get()}
      onChange={evt => props.onChange(evt.target.value)}
      placeholder="快速查找"
    />
    <img className={style['filter-icon']} src="./images/search.png" />
  </div>
)

/**
 * 创建单词卡
 * @param {string[]} words 单词
 * @return {JSX.Element[]}
 */
const createWordCards = words => Object.keys(words).map(word => <WordCard key={word} word={word} remark={words[word]} />)

/**
 * 过滤器的关键字
 *
 * 是可观察的
 */
const filterKeyword = observable.box('')

// eslint-disable-next-line
export default observer((/** @type {{wordsStore: {words: string[]}}} */ props) => {
  return (
    <div className={style['cards']}>
      <AddWord />
      <Filter prefix={filterKeyword} />
      <ol>
        {createWordCards(
          chain(pick)(
            compose(
              filter(v => v.indexOf(filterKeyword.get()) != -1),
              keys
            )
          )(props.wordsStore.words)
        )}
      </ol>
    </div>
  )
})
