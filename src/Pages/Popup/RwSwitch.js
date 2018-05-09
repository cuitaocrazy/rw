import React from 'react'
import style from '../WordNote/wordnode.css'

const currentTab = new Promise((resolve, reject) =>
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs.length > 0) {
      const currentTab = tabs[0]
      if (currentTab.url.startsWith('http:') || currentTab.url.startsWith('https:') || currentTab.url.startsWith('file:')) {
        resolve(currentTab)
        return
      }
    }
    resolve()
  })
)
const getStatus = id =>
  new Promise((resolve, reject) => chrome.tabs.sendMessage(id, { evtType: 'tw-get-status' }, status => resolve({ id, disable: status.disable })))

async function getCurrentTabStatus() {
  return await getStatus((await currentTab).id)
}

export default class RwSwitch extends React.Component {
  constructor() {
    super()
    this.state = { extEnable: false, loaded: false }
    let sendStatus
    getCurrentTabStatus().then(status => {
      sendStatus = () => chrome.tabs.sendMessage(status.id, { evtType: 'rw-change-status' }, () => {})
      this.setState({ extEnable: !status.disable, loaded: true })
    })
    this.onCheckboxClick = () => {
      sendStatus()
      this.setState({ extEnable: !this.state.extEnable })
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
