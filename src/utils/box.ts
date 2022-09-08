import { Coordinate } from './coordinate'
import { createSignal } from 'solid-js'
import { ChatBoxInfo } from './chat'
import { addOrUpdateInfoFromPrev } from './info'
import { ScreenBoxInfo } from './screen'

// Box Type
export const BoxTypes = {
  CHAT: 'chat',
  SCREEN: 'screen',
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

export type RoomBoxInfo = ChatBoxInfo | ScreenBoxInfo

export const [getRoomBoxInfos, setRoomBoxInfos] = createSignal<RoomBoxInfo[]>(
  []
)

export const setRoomBoxInfo = (roomBoxInfo: RoomBoxInfo) => {
  setRoomBoxInfos(
    addOrUpdateInfoFromPrev(roomBoxInfo, (curr, info) => curr.id === info.id)
  )
}
