import { createEffect, createMemo, JSX, onMount } from 'solid-js'
import { RoomBoxInfo, setRoomBoxInfo, BoxInfo } from '../../utils/box'
import { localUserInfo } from '../../utils/user'
import { sendRoomBoxInfoToAll } from '../../utils/sendRoomBoxInfo'
import clickOutsideDirective from '../../directives/clickOutside'
const clickOutside = clickOutsideDirective
import { createResizeObserver } from '@solid-primitives/resize-observer'

function RoomBox(props: {
  boxInfo: RoomBoxInfo
  class: string
  children: JSX.Element
}) {
  let coordRef: HTMLDivElement
  let divRef: HTMLDivElement
  const isEditing = createMemo(
    () =>
      localUserInfo() && localUserInfo().peerId === props.boxInfo.editorPeerId
  )

  onMount(() => {
    createResizeObserver(divRef, () => {
      const width = divRef.clientWidth
      const height = divRef.clientHeight
      console.log('div', width, height)
      if (
        isEditing() &&
        (width / 5 !== props.boxInfo.width / 5 ||
          height / 5 !== props.boxInfo.height / 5)
      ) {
        const roomBoxInfo: RoomBoxInfo = {
          ...props.boxInfo,
          width,
          height,
        }
        setRoomBoxInfo(roomBoxInfo)
        sendRoomBoxInfoToAll(roomBoxInfo)
      }
    })
  })

  createEffect(() => {
    coordRef.style.left = `${props.boxInfo.x}px`
    coordRef.style.top = `${props.boxInfo.y}px`
  })
  createEffect(() => {
    divRef.style.width = `${props.boxInfo.width}px`
    divRef.style.height = `${props.boxInfo.height}px`
  })

  //
  // Move Box
  //
  let isMoving = false
  let preTimeMs = Date.now()
  let actualSendDurationMs = 0

  const [onMouseDown, onTouchStart] = (() => {
    const f = () => {
      isMoving = true
      preTimeMs = Date.now()
      actualSendDurationMs = 0
      sendRoomBoxInfoToAll(props.boxInfo)
    }
    return [f, f]
  })()

  ;['mouseup', 'touchend'].forEach((eventType) => {
    window.addEventListener(eventType, () => {
      if (isMoving) {
        isMoving = false
        sendRoomBoxInfoToAll(props.boxInfo)
      }
    })
  })

  const setOnMovement = (x: BoxInfo['x'], y: BoxInfo['y']) => {
    // set info
    const roomBoxInfo: RoomBoxInfo = {
      ...props.boxInfo,
      x,
      y,
    }
    setRoomBoxInfo(roomBoxInfo)

    const sendDurationMs = 500
    const nowTimeMs = Date.now()
    actualSendDurationMs += nowTimeMs - preTimeMs
    preTimeMs = nowTimeMs
    if (actualSendDurationMs >= sendDurationMs) {
      actualSendDurationMs -= sendDurationMs
      sendRoomBoxInfoToAll(props.boxInfo)
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
    setOnMovement(touch.pageX, touch.pageY)
  }

  window.addEventListener('mousemove', mouseMoveListener, { passive: false })
  window.addEventListener('touchmove', touchMoveListener, { passive: false })

  return (
    <div ref={coordRef} class="absolute">
      {/* Move cursor */}
      {isEditing() ? (
        <div
          class="absolute cursor-move"
          style={{ left: '-1.5rem', top: '-1.5rem' }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          <span class="material-symbols-outlined">open_with</span>
        </div>
      ) : null}

      {/* Content */}
      <div
        ref={divRef}
        class={`${isEditing() ? 'resize overflow-hidden' : ''} ${props.class}`}
        onClick={() => {
          console.log('inside click')
          if (localUserInfo() && !isEditing() && !props.boxInfo.editorPeerId) {
            const roomBoxInfo: RoomBoxInfo = {
              ...props.boxInfo,
              editorPeerId: localUserInfo().peerId,
            }
            setRoomBoxInfo(roomBoxInfo)
            sendRoomBoxInfoToAll(roomBoxInfo)
          }
        }}
        // eslint-disable-next-line solid/reactivity
        use:clickOutside={() => {
          console.log('outside click')
          if (isEditing()) {
            const roomBoxInfo: RoomBoxInfo = {
              ...props.boxInfo,
              editorPeerId: null,
            }
            setRoomBoxInfo(roomBoxInfo)
            sendRoomBoxInfoToAll(roomBoxInfo)
          }
        }}
      >
        {`${props.boxInfo.width}px ${props.boxInfo.height}px`}
        {isEditing() ? 'hennshuu' : 'not'}
        {props.children}
      </div>
    </div>
  )
}

export default RoomBox
