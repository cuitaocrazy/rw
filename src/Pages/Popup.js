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

const RwSwitch = observer(props => (
  <div>
    <button
      onClick={evt => {
        chrome.tabs.sendMessage(props.chromeTab.tab.id, { evtType: 'rw-change-status' }, () => {})
      }}
      disabled={!props.chromeTab.tab}
    >
      启用/禁用
    </button>
  </div>
))

class RwSetting extends React.Component {
  constructor() {
    super()
    this.state = {
      canEdit: false,
      defaultEnable: false,
    }
    chrome.storage.local.get(['defaultDisable'], result => this.setState({ canEdit: true, defaultEnable: !result['defaultDisable'] }))
    this.setSettings = defaultEnable => {
      this.setState({ canEdit: false })
      chrome.storage.local.set({ defaultDisable: !defaultEnable }, () => this.setState({ canEdit: true, defaultEnable }))
    }
  }

  render() {
    return (
      <div>
        <label>
          默认开启:
          <input type="checkbox" disabled={!this.state.canEdit} checked={this.state.defaultEnable} onChange={evt => this.setSettings(evt.target.checked)} />
        </label>
      </div>
    )
  }
}
export default () => (
  <div>
    <div>
      <button onClick={() => createTab('word-note.html')}>单词本</button>
    </div>
    <RwSwitch chromeTab={chromeTab} />
    <RwSetting />
  </div>
)
