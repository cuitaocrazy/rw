import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import WordNote from './Pages/WordNote'
import { chget, onChange } from './words-api'

const wordsStore = observable({
  words: {},
})

chget(words => (wordsStore.words = words))
onChange(words => (wordsStore.words = words))

const container = document.getElementById('container')

render(<WordNote wordsStore={wordsStore} />, container)
