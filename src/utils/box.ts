import { Coordinate } from './coordinate'
import { createSignal } from 'solid-js'
import { ChatBoxInfo } from './chat'

// Box Type
export const BoxTypes = {
  CHAT: 'chat',
} as const
export type BoxType = typeof BoxTypes[keyof typeof BoxTypes]
export const AllBoxType = Object.values(BoxTypes)

export type BoxInfo = Coordinate & {
  boxType: BoxType
  id: number
  width: number
  height: number
  editorPeerId?: string
}

export type RoomBoxInfo = ChatBoxInfo

export const [getRoomBoxInfos, setRoomBoxInfos] = createSignal<RoomBoxInfo[]>([
  {
    boxType: BoxTypes.CHAT,
    id: 1,
    x: 2048,
    y: 2048,
    deg: 0,
    width: 300,
    height: 300,
    editorPeerId: null,
    // Chat Box
    chatGroup: 0,
  },
])

export const setRoomBoxInfo = (roomBoxInfo: RoomBoxInfo) => {
  setRoomBoxInfos((prev) => {
    let newInfo = true
    const infos = prev.map((curr) => {
      if (curr.id === roomBoxInfo.id) {
        newInfo = false
        return roomBoxInfo
      }
      return curr
    })

    if (newInfo) {
      infos.push(roomBoxInfo)
    }

    return infos
  })
}
