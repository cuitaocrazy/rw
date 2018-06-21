import React from 'react'
import style from './popup.css'
import RwSwitch from './RwSwitch'
import { chgetL, chsetL } from '../../chrome-api'

/**
 * 为单词本创建一个Tab
 * @param {string} htmlfile 单词本的html文件相对路径
 * @return {void}
 */
const createTab = htmlfile => chrome.tabs.create({ url: chrome.extension.getURL(htmlfile) }, () => {})

/**
 * 单词本配置组件
 */
class RwSetting extends React.Component {
  constructor() {
    super()
    this.state = {
      canEdit: false,
      defaultEnable: false,
    }
    chgetL(['defaultDisable']).then(result => this.setState({ canEdit: true, defaultEnable: !result['defaultDisable'] }))
    this.setSettings = defaultEnable => {
      this.setState({ canEdit: false })
      chsetL({ defaultDisable: !defaultEnable }).then(() => this.setState({ canEdit: true, defaultEnable }))
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
