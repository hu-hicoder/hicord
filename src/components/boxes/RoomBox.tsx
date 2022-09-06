import { createEffect, createMemo, JSX } from 'solid-js'
import createResizeObserver from '../../utils/resize'
import { getRoomBoxInfos, RoomBoxInfo, setRoomBoxInfo } from '../../utils/box'
import { localUserInfo } from '../../utils/user'
import { sendRoomBoxInfoToAll } from '../../utils/sendRoomBoxInfo'
import clickOutsideDirective from '../../directives/clickOutside'
const clickOutside = clickOutsideDirective

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

  createEffect(() => {
    divRef.style.left = `${props.boxInfo.x}px`
    divRef.style.top = `${props.boxInfo.y}px`
    divRef.style.width = `${props.boxInfo.width}px`
    divRef.style.height = `${props.boxInfo.height}px`
  })

  // createEffect(() => {
  //   const handleResize = (entries: ResizeObserverEntry[]) => {
  //     const width = entries[0].target.clientWidth
  //     const height = entries[0].target.clientHeight
  //     console.log(width, height)

  //     if (
  //       isEditing() &&
  //       (width !== props.boxInfo.width || height !== props.boxInfo.height)
  //     ) {
  //       const roomBoxInfo: RoomBoxInfo = {
  //         ...props.boxInfo,
  //         width,
  //         height,
  //       }
  //       setRoomBoxInfo(roomBoxInfo)
  //       sendRoomBoxInfoToAll(roomBoxInfo)
  //     }
  //   }

  //   createResizeObserver([divRef], handleResize)
  // }, [divRef])

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
