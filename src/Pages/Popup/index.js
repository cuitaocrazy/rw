import React from 'react'
import style from './popup.css'
import RwSwitch from './RwSwitch'

const createTab = htmlfile => chrome.tabs.create({ url: chrome.extension.getURL(htmlfile) }, () => {})

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
