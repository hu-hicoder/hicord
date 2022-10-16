import { createMemo } from 'solid-js'
import { collision, Coordinate } from '../coordinate'
import {
  USER_ICON_WIDTH,
  USER_ICON_HEIGHT,
} from '../../components/userIcons/UserIcon'
import { getRoomBoxInfos, BoxInfo, BoxTypes } from './box'

export type TalkBoxInfo = BoxInfo

export const isTalkBoxInfo = (data: unknown): data is TalkBoxInfo =>
  typeof data === 'object' &&
  data !== null &&
  (data as TalkBoxInfo).boxType === BoxTypes.TALK &&
  typeof (data as TalkBoxInfo).x === 'number' &&
  typeof (data as TalkBoxInfo).y === 'number' &&
  typeof (data as TalkBoxInfo).deg === 'number' &&
  typeof (data as TalkBoxInfo).width === 'number' &&
  typeof (data as TalkBoxInfo).height === 'number' &&
  typeof (data as TalkBoxInfo).id === 'number'

// on a talk box
export const getTalkBoxInfos = createMemo(() => {
  const talkBoxInfos = getRoomBoxInfos().filter(
    (box) => box.boxType === BoxTypes.TALK
  )
  return talkBoxInfos
})
export const talkBoxIdFromUser = (
  x: Coordinate['x'],
  y: Coordinate['y']
): number => {
  const talkBoxInfos = getTalkBoxInfos()
  for (let index = 0; index < talkBoxInfos.length; index++) {
    const talkBoxInfo = talkBoxInfos[index]
    if (
      collision(
        x,
        y,
        USER_ICON_WIDTH,
        USER_ICON_HEIGHT,
        talkBoxInfo.x,
        talkBoxInfo.y,
        talkBoxInfo.width,
        talkBoxInfo.height
      )
    ) {
      // TODO two or more
      return talkBoxInfo.id
    }
  }
  return 0
}
