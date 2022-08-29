import type { Component } from 'solid-js'
import UserIcon, { USER_ICON_WIDTH, USER_ICON_HEIGHT } from './UserIcon'
import {
  localUserInfo,
  setLocalUserInfo,
  remoteUserInfos,
  UserCoordinate,
} from '../utils/user'
import { PEER } from './Room'
import { setListener } from '../utils/audio'

const LocalUserIcon: Component = () => {
  let localDiv: HTMLDivElement
  let isMoving = false
  let preTimeMs = Date.now()
  let actualSendDurationMs = 0

  const onMouseMove = (event: MouseEvent) => {
    if (!isMoving) return

    // prevent
    event.preventDefault()
    // set info
    setLocalUserInfo((preUserInfo) => {
      const x = event.pageX - USER_ICON_WIDTH / 2
      const y = event.pageY - USER_ICON_HEIGHT / 2
      const dx = x - preUserInfo.x
      const dy = y - preUserInfo.y
      let deg = preUserInfo.deg
      if (25 < dx ** 2 + dy ** 2) {
        let r = Math.atan2(dy, dx)
        if (r < 0) {
          r = r + 2 * Math.PI
        }
        deg = Math.floor((r * 360) / (2 * Math.PI)) - 90
      }

      return {
        ...preUserInfo,
        x: x,
        y: y,
        deg: deg,
      }
    })
    // set listener
    setListener(localUserInfo())

    const sendDurationMs = 500
    const nowTimeMs = Date.now()
    actualSendDurationMs += nowTimeMs - preTimeMs
    preTimeMs = nowTimeMs
    if (actualSendDurationMs >= sendDurationMs) {
      actualSendDurationMs -= sendDurationMs
      sendUserInfo()
    }
  }

  const onMouseDown = () => {
    isMoving = true
    preTimeMs = Date.now()
    actualSendDurationMs = 0
    sendUserInfo()
  }

  const onMouseUp = () => {
    if (isMoving) {
      isMoving = false
      sendUserInfo()
    }
  }

  const onMouseLeave = () => {
    if (isMoving) {
      isMoving = false
      sendUserInfo()
    }
  }

  return (
    <UserIcon info={localUserInfo()}>
      <div
        ref={localDiv}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        class="w-full h-full cursor-grab"
      />
    </UserIcon>
  )
}

function sendUserInfo() {
  remoteUserInfos().forEach((rInfo) => {
    const dataConnection = PEER.connect(rInfo.peerId)

    dataConnection.on('open', () => {
      const data: UserCoordinate = {
        x: localUserInfo().x,
        y: localUserInfo().y,
        deg: localUserInfo().deg,
      }
      dataConnection.send(data)
    })
  })
}

export default LocalUserIcon
