/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, createEffect } from 'solid-js'
import UserIcon from './UserIcon'
import { localUserInfo, setLocalUserInfo, UserInfo } from '../../utils/user'
import { setAudioListener } from '../../utils/audio'
import { sendLocalUserCoordinateToAll } from '../../utils/send/sendLocalUserCoordinate'
import { updateDeg } from '../../utils/coordinate'

const LocalUserIcon: Component = () => {
  let localUserIconDiv: HTMLDivElement | undefined
  let isMoving = false
  let preTimeMs = Date.now()
  let actualSendDurationMs = 0

  const [onMouseDown, onTouchStart] = (() => {
    const f = () => {
      isMoving = true
      preTimeMs = Date.now()
      actualSendDurationMs = 0
      sendLocalUserCoordinateToAll()
    }
    return [f, f]
  })()

  ;['mouseup', 'touchend'].forEach((eventType) => {
    window.addEventListener(eventType, () => {
      if (isMoving) {
        isMoving = false
        sendLocalUserCoordinateToAll()
      }
    })
  })

  const setOnMovement = (x: UserInfo['x'], y: UserInfo['y']) => {
    // set info
    setLocalUserInfo((preUserInfo) => {
      if (preUserInfo === undefined) return

      const dx = x - preUserInfo.x
      const dy = y - preUserInfo.y
      const deg = updateDeg(dx, dy, preUserInfo.deg)

      return {
        ...preUserInfo,
        x: x,
        y: y,
        deg: deg,
      }
    })
    // set audio listener
    setAudioListener()

    const sendDurationMs = 500
    const nowTimeMs = Date.now()
    actualSendDurationMs += nowTimeMs - preTimeMs
    preTimeMs = nowTimeMs
    if (actualSendDurationMs >= sendDurationMs) {
      actualSendDurationMs -= sendDurationMs
      sendLocalUserCoordinateToAll()
    }
  }

  const mouseMoveListener = (event: MouseEvent) => {
    if (!isMoving) return

    event.preventDefault()
    setOnMovement(event.pageX, event.pageY)
  }

  const touchMoveListener = (event: TouchEvent) => {
    if (!isMoving) return
    if (event.touches.length !== 1) return

    event.preventDefault()
    const touch = event.touches.item(0)
    if (touch !== null) setOnMovement(touch.pageX, touch.pageY)
  }

  window.addEventListener('mousemove', mouseMoveListener, { passive: false })
  window.addEventListener('touchmove', touchMoveListener, { passive: false })

  createEffect(() => {
    console.log('mute change')
    const _localUserInfo = localUserInfo()
    if (_localUserInfo === undefined) return

    if (_localUserInfo.muted) {
      _localUserInfo?.stream.getAudioTracks().forEach((track) => {
        track.enabled = false
      })
    } else {
      _localUserInfo.stream.getAudioTracks().forEach((track) => {
        track.enabled = true
      })
    }
  })

  return (
    <div
      ref={localUserIconDiv}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      class="cursor-grab"
    >
      <UserIcon info={localUserInfo()} />
    </div>
  )
}

export default LocalUserIcon
