import { createEffect, createMemo, JSX, onMount } from 'solid-js'
import { getRoomBoxInfos, RoomBoxInfo, setRoomBoxInfo } from '../../utils/box'
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
    divRef.style.left = `${props.boxInfo.x}px`
    divRef.style.top = `${props.boxInfo.y}px`
    divRef.style.width = `${props.boxInfo.width}px`
    divRef.style.height = `${props.boxInfo.height}px`
  })

  return (
    <div
      ref={divRef}
      class={`absolute ${isEditing() ? 'resize overflow-hidden' : ''} ${
        props.class
      }`}
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
      {getRoomBoxInfos()?.length}
      {props.children}
    </div>
  )
}

export default RoomBox
