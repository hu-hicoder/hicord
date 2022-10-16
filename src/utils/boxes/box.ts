import { createSignal } from 'solid-js'
import { Coordinate } from '../coordinate'
import { addOrUpdateInfoFromPrev } from '../info'
import { Size } from '../size'
import { ChatBoxInfo } from './chat'
import { ScreenBoxInfo } from './screen'
import { ImageBoxInfo } from './image'
import { TalkBoxInfo } from './talk'

// Box Type
export const BoxTypes = {
  CHAT: 'chat',
  IMAGE: 'image',
  SCREEN: 'screen',
  TALK: 'talk',
} as const
export type BoxType = typeof BoxTypes[keyof typeof BoxTypes]
export const AllBoxType = Object.values(BoxTypes)

export type BoxInfo = Coordinate &
  Size & {
    boxType: BoxType
    id: number
    editorPeerId?: string
  }

export type RoomBoxInfo =
  | ChatBoxInfo
  | ImageBoxInfo
  | ScreenBoxInfo
  | TalkBoxInfo

export const [getRoomBoxInfos, setRoomBoxInfos] = createSignal<RoomBoxInfo[]>(
  []
)

export const setRoomBoxInfo = (roomBoxInfo: RoomBoxInfo) => {
  setRoomBoxInfos(
    addOrUpdateInfoFromPrev(roomBoxInfo, (curr, info) => curr.id === info.id)
  )
}
