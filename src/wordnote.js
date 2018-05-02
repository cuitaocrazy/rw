import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import WordNote from './Pages/WordNote'
import { wordsReducer } from './reducers'

const store = createStore(wordsReducer, {
  apple: '苹果',
  banana: '香蕉',
})

const container = document.getElementById('container')

render(
  <Provider store={store}>
    <WordNote />
  </Provider>,
  container
)
