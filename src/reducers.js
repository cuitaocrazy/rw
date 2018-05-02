import { createReducer } from 'redux-act'
import { addOrUpdate, del } from './actions'
import * as R from 'ramda'

export const wordsReducer = createReducer({
  [addOrUpdate]: (words, payload) => R.assoc(payload.word, payload.remark)(words),
  [del]: (words, word) => R.dissoc(word)(words),
})

export default { wordsReducer }
