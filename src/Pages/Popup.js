import React from 'react'

export default () => (
  <button
    onClick={() =>
      chrome.tabs.create(
        { url: chrome.extension.getURL('word-note.html') },
        () => {}
      )
    }
  >
    单词本
  </button>
)
