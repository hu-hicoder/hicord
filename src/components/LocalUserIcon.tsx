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

  // mouse move
  let mouseMoveCount = 0
  function onMouseMove(event: MouseEvent) {
    if (!isMoving) return

    mouseMoveCount += 1
    // prevent
    event.preventDefault()
    // set info
    setLocalUserInfo((prev) => {
      const x = event.pageX - USER_ICON_WIDTH / 2
      const y = event.pageY - USER_ICON_HEIGHT / 2

      const dx = x - prev.x
      const dy = y - prev.y
      let deg = prev.deg
      if (25 < Math.abs(dx ** 2 + dy ** 2)) {
        let r = Math.atan2(dy, dx)
        if (r < 0) {
          r = r + 2 * Math.PI
        }
        deg = Math.floor((r * 360) / (2 * Math.PI)) - 90
      }

      return {
        ...prev,
        x: x,
        y: y,
        deg: deg,
      }
    })
    // set listener
    setListener(localUserInfo())

    if (mouseMoveCount % 32 === 0) {
      sendUserInfo()
    }
  }

  function onMouseDown() {
    isMoving = true
    sendUserInfo()
  }

  function onMouseUp() {
    if (isMoving) {
      isMoving = false
      sendUserInfo()
    }
  }

  function onMouseLeave() {
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
