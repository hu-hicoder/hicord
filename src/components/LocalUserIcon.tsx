import type { Component } from 'solid-js'
import UserIcon, { USER_ICON_X, USER_ICON_Y } from './UserIcon'
import {
  localUserInfo,
  setLocalUserInfo,
  remoteUserInfos,
  UserCoord,
} from '../utils/user'
import { PEER } from './Room'
const LocalUserIcon: Component = () => {
  let localDiv

  // mouse down
  function mdown(e) {
    // mouse and touch event
    // if(e.type === "mousedown") {
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     let event = e;
    // } else {
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     let event = e.changedTouches[0];
    // }

    // add move event
    document.body.addEventListener('mousemove', mmove, false)
    document.body.addEventListener('touchmove', mmove, false)
  }

  // mouse move
  let mouseMoveCount = 0
  function mmove(e) {
    mouseMoveCount += 1

    // mouse and touch event
    let event
    if (e.type === 'mousemove') {
      event = e
    } else {
      event = e.changedTouches[0]
    }

    // prevent
    e.preventDefault()

    // set info
    setLocalUserInfo((prev) => {
      if (prev) {
        const x = event.pageX - USER_ICON_X / 2
        const y = event.pageY - USER_ICON_Y / 2

        const dx = x - prev.x
        const dy = y - prev.y
        let deg = prev.deg
        if (5 < Math.abs(dx) || 5 < Math.abs(dy)) {
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
      }
      return prev
    })

    if (mouseMoveCount % 32 === 0) {
      // send user info
      sendUserInfo()
    }

    // add mouse up event
    localDiv.addEventListener('mouseup', mup, false)
    document.body.addEventListener('mouseleave', mup, false)
    localDiv.addEventListener('touchend', mup, false)
    document.body.addEventListener('touchleave', mup, false)
  }

  // mouse up
  function mup(e) {
    // send user info
    sendUserInfo()

    // delete move event
    document.body.removeEventListener('mousemove', mmove, false)
    localDiv.removeEventListener('mouseup', mup, false)
    document.body.removeEventListener('touchmove', mmove, false)
    localDiv.removeEventListener('touchend', mup, false)
  }

  return (
    <UserIcon info={localUserInfo()}>
      <div
        ref={localDiv}
        onMouseDown={mdown}
        class="w-full h-full cursor-grab"
      />
    </UserIcon>
  )
}

function sendUserInfo() {
  // send user info
  remoteUserInfos().forEach((rInfo) => {
    const dataConnection = PEER.connect(rInfo.peerId)

    dataConnection.on('open', () => {
      const data: UserCoord = {
        x: localUserInfo().x,
        y: localUserInfo().y,
        deg: localUserInfo().deg,
      }
      dataConnection.send(data)
    })
  })
}

export default LocalUserIcon
