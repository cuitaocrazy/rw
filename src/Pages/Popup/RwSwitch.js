import React from 'react'
import style from './popup.css'
import { GET_TAB_STATUS, ENABLE_TAB_RW, DISABLE_TAB_RW } from '../../msgs/evt-type'
import { tabQuery, sendMessageToTab } from '../../chrome-api'

/**
 * 当前的Tab
 */
const currentTab = tabQuery({ active: true, currentWindow: true }).then(
  tabs => (tabs.length && (tabs[0].url.startsWith('http:') || tabs[0].url.startsWith('https:') || tabs[0].url.startsWith('file:')) ? tabs[0] : null)
)

/**
 * 获取当前TAB单词本的启用状态
 * @return {Promise<boolean?>}
 */
const getTabStatus = async () => {
  const tab = await currentTab
  return tab && (await sendMessageToTab(tab.id, { evtType: GET_TAB_STATUS }))
}

/**
 * TAB启用单词本控制器组件
 */
export default class RwSwitch extends React.Component {
  constructor() {
    super()
    this.state = { extEnable: false, loaded: false }
    getTabStatus().then(disabled => disabled == null || this.setState({ extEnable: !disabled, loaded: true }))
    this.onCheckboxClick = () => {
      const enableFlag = this.state.extEnable
      this.setState({ loaded: false, extEnable: !this.state.extEnable })
      const msg = !enableFlag ? { evtType: ENABLE_TAB_RW } : { evtType: DISABLE_TAB_RW }
      currentTab.then(tab => tab && sendMessageToTab(tab.id, msg)).then(() => this.setState({ loaded: true }))
    }
  }

  render() {
    return (
      <div className={style['switch-bar']}>
        <input
          type="checkbox"
          id="switch"
          className={style['btn-switch']}
          checked={this.state.extEnable}
          onClick={this.onCheckboxClick}
          disabled={!this.state.loaded}
        />
        <label className={style['label-switch']} htmlFor="switch">
          {' '}
        </label>
      </div>
    )
  }
}
