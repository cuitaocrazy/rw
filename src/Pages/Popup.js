import React from 'react'

const createTab = htmlfile => chrome.tabs.create({ url: chrome.extension.getURL(htmlfile) }, () => {})

export default () => (
  <div>
    <button onClick={() => createTab('word-note.html')}>单词本</button>
  </div>
)
