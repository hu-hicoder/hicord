import { v4 as uuidv4 } from 'uuid'
import { localUserInfo } from './user'
import { setScreenInfo, ScreenInfo, ScreenBoxInfo } from './boxes/screen'
import { sendRoomBoxInfoToAll } from './send/sendRoomBoxInfo'
import { BoxTypes, setRoomBoxInfo } from './boxes/box'

export const screenCapture = async () => {
  const mStream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
  })
  console.log('create screen capture')
  const localUserPeerId = localUserInfo.peerId
  if (localUserPeerId === undefined) return

  const screenInfo: ScreenInfo = {
    mStream,
  }

  setScreenInfo(screenInfo)
  // Room Box
  const roomBox: ScreenBoxInfo = {
    boxType: BoxTypes.SCREEN,
    id: uuidv4(),
    x: 2048,
    y: 2048,
    deg: 0,
    width: 300,
    height: 300,
    editorPeerId: undefined,
    // Screen Box
    peerId: localUserPeerId,
    mStreamId: screenInfo.mStream.id,
  }
  setRoomBoxInfo(roomBox)
  sendRoomBoxInfoToAll(roomBox)
}
