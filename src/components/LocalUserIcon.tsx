import type { Component } from 'solid-js'
import UserIcon, { USER_ICON_WIDTH, USER_ICON_HEIGHT } from './UserIcon'
import { localUserInfo, setLocalUserInfo } from '../utils/user'
import { setListener } from '../utils/audio'
import { sendUserCoordinateToAll } from '../utils/sendUserCoordinate'

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
      sendUserCoordinateToAll()
    }
  }

  const onMouseDown = () => {
    isMoving = true
    preTimeMs = Date.now()
    actualSendDurationMs = 0
    sendUserCoordinateToAll()
  }

  const onMouseUp = () => {
    if (isMoving) {
      isMoving = false
      sendUserCoordinateToAll()
    }
  }

  const onMouseLeave = () => {
    if (isMoving) {
      isMoving = false
      sendUserCoordinateToAll()
    }
  }

  return (
    <div
      ref={localDiv}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      class="cursor-grab"
    >
      <UserIcon info={localUserInfo()} />
    </div>
  )
}

export default LocalUserIcon
