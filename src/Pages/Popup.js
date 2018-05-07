import React from 'react'
import { observable } from 'mobx'
import { observer } from 'mobx-react'

const createTab = htmlfile => chrome.tabs.create({ url: chrome.extension.getURL(htmlfile) }, () => {})

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  if (tabs.length > 0) {
    const currentTab = tabs[0]
    if (currentTab.url.startsWith('http:') || currentTab.url.startsWith('https:') || currentTab.url.startsWith('file:')) {
      chromeTab.tab = currentTab
    }
  }
})

const chromeTab = observable({
  tab: undefined,
})

const TabBtn = observer(props => (
  <button
    onClick={evt => {
      chrome.tabs.sendMessage(props.chromeTab.tab.id, { evtType: 'rw-change' }, () => {})
    }}
    disabled={!props.chromeTab.tab}
  >
    启用/禁用
  </button>
))
export default () => (
  <div>
    <button onClick={() => createTab('word-note.html')}>单词本</button>
    <TabBtn chromeTab={chromeTab} />
  </div>
)
