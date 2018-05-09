import React from 'react'
// import { observable } from 'mobx'
// import { observer } from 'mobx-react'
import style from './popup.css'
import RwSwitch from './RwSwitch'

const createTab = htmlfile => chrome.tabs.create({ url: chrome.extension.getURL(htmlfile) }, () => {})

// chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//   if (tabs.length > 0) {
//     const currentTab = tabs[0]
//     if (currentTab.url.startsWith('http:') || currentTab.url.startsWith('https:') || currentTab.url.startsWith('file:')) {
//       chromeTab.tab = currentTab
//     }
//   }
// })

// const chromeTab = observable({
//   tab: undefined,
// })

// const RwSwitch = observer(props => (
//   <div className={style['switch-bar']}>
//     <input
//       type="checkbox"
//       id="switch"
//       className={style['btn-switch']}
//       onClick={evt => {
//         chrome.tabs.sendMessage(props.chromeTab.tab.id, { evtType: 'rw-change-status' }, () => {})
//       }}
//       disabled={!props.chromeTab.tab}
//     />
//     <label className={style['label-switch']} htmlFor="switch">
//       {' '}
//     </label>
//   </div>
// ))

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
      <div className={style['check-bar']}>
        <input
          id="rw-checkbox"
          className={style['check-box']}
          type="checkbox"
          disabled={!this.state.canEdit}
          checked={this.state.defaultEnable}
          onChange={evt => this.setSettings(evt.target.checked)}
        />
        <label htmlFor="rw-checkbox" className={style['check-title']}>
          默认开启:
        </label>
      </div>
    )
  }
}
export default () => (
  <div className={style['btn-bar']}>
    <button className={style['note-btn']} onClick={() => createTab('word-note.html')}>
      <span className={style['note-title']}>English</span>
      <span className={style['note-title']}>我的</span>单词本
    </button>
    <RwSwitch />
    <RwSetting />
  </div>
)
