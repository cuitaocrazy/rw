import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import WordNote from './Pages/WordNote'
import { getWords, onChange } from './words-api'

const wordsStore = observable({
  words: {},
})

getWords().then(words => (wordsStore.words = words))
onChange(words => (wordsStore.words = words))

const container = document.getElementById('container')

render(<WordNote wordsStore={wordsStore} />, container)
