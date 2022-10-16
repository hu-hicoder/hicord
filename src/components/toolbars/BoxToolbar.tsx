import {
  setRoomBoxInfo,
  BoxTypes,
  getRoomBoxInfos,
} from '../../utils/boxes/box'
import { ChatBoxInfo } from '../../utils/boxes/chat'
import { TalkBoxInfo } from '../../utils/boxes/talk'
import { sendRoomBoxInfoToAll } from '../../utils/send/sendRoomBoxInfo'
import { localUserInfo } from '../../utils/user'
import { getRandomInt } from '../../utils/utils'

const BoxToolbar = () => {
  const addChatBox = () => {
    const chatBox: ChatBoxInfo = {
      boxType: BoxTypes.CHAT,
      id: getRoomBoxInfos().length + 1,
      x: localUserInfo.x + 20 + getRandomInt(30),
      y: localUserInfo.y - 20 - getRandomInt(30),
      deg: 0,
      width: 400,
      height: 300,
      editorPeerId: undefined,
      // Chat Box
      chatGroup: getRoomBoxInfos().length + 1,
    }
    setRoomBoxInfo(chatBox)
    sendRoomBoxInfoToAll(chatBox)
  }
  const addTalkBox = () => {
    const talkBox: TalkBoxInfo = {
      boxType: BoxTypes.TALK,
      id: getRoomBoxInfos().length + 1,
      x: localUserInfo.x + 20 + getRandomInt(30),
      y: localUserInfo.y - 20 - getRandomInt(30),
      deg: 0,
      width: 300,
      height: 300,
      editorPeerId: undefined,
    }
    setRoomBoxInfo(talkBox)
    sendRoomBoxInfoToAll(talkBox)
  }
  return (
    <div class="fixed sm:right-6 sm:bottom-6 right-4 bottom-4 tb-card">
      <span class="material-symbols-outlined tb-item" onClick={addChatBox}>
        chat
      </span>
      <span class="material-symbols-outlined tb-item" onClick={addTalkBox}>
        group_work
      </span>
    </div>
  )
}

export default BoxToolbar
