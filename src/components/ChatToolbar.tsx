import { setRoomBoxInfo, BoxTypes, getRoomBoxInfos } from '../utils/box'
import { sendRoomBoxInfoToAll } from '../utils/send/sendRoomBoxInfo'

const ChatToolbar = () => {
  const addChatBox = () => {
    const roomBox = {
      boxType: BoxTypes.CHAT,
      id: getRoomBoxInfos().length + 1,
      x: 2048,
      y: 2048,
      deg: 0,
      width: 300,
      height: 300,
      editorPeerId: null,
      // Chat Box
      chatGroup: 0,
    }
    setRoomBoxInfo(roomBox)
    sendRoomBoxInfoToAll(roomBox)
  }
  return (
    <div class="fixed sm:right-6 sm:bottom-6 right-4 bottom-4 tb-card">
      <span class="material-symbols-outlined tb-item" onClick={addChatBox}>
        chat
      </span>
    </div>
  )
}

export default ChatToolbar
