import { createAction } from 'redux-act'

export const ADD_OR_UPDATE = 'ADD_OR_UPDATE'
export const DEL = 'DEL'

export const addOrUpdate = createAction(ADD_OR_UPDATE, (word, remark) => ({ word, remark }))
export const del = createAction(DEL)

export default { addOrUpdate, del, ADD_OR_UPDATE, DEL }
