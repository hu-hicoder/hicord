import { localUserInfo } from './user'
import { setScreenInfo, ScreenInfo, ScreenBoxInfo } from './boxes/screen'
import { sendRoomBoxInfoToAll } from './send/sendRoomBoxInfo'
import { BoxTypes, getRoomBoxInfos, setRoomBoxInfo } from './boxes/box'

export const screenCapture = async () => {
  const mStream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
  })
  console.log('create screen capture')
  const localPeerId = localUserInfo()?.peerId
  if (localPeerId === undefined) return

  const screenInfo: ScreenInfo = {
    mStream,
  }

  setScreenInfo(screenInfo)
  // Room Box
  const roomBox: ScreenBoxInfo = {
    boxType: BoxTypes.SCREEN,
    id: getRoomBoxInfos().length + 1,
    x: 2048,
    y: 2048,
    deg: 0,
    width: 300,
    height: 300,
    editorPeerId: undefined,
    // Screen Box
    peerId: localPeerId,
    mStreamId: screenInfo.mStream.id,
  }
  setRoomBoxInfo(roomBox)
  sendRoomBoxInfoToAll(roomBox)
}
