import type { Component } from 'solid-js'
import { sendChatInfoToAll } from '../utils/sendChatInfo'
import { setChatInfos, localChatInfoFrom } from '../utils/chat'

const ChatInput: Component<{ chatId: number }> = (props) => {
  let chatRef: HTMLInputElement

  function sendChat() {
    const chatInfo = localChatInfoFrom({
      chatId: props.chatId,
      value: chatRef.value,
    })
    sendChatInfoToAll(chatInfo)
    setChatInfos((prev) => [...prev, chatInfo])
    chatRef.value = ''
  }

  return (
    <div>
      <input
        ref={chatRef}
        type="text"
        class="input input-bordered"
        placeholder="Chat"
      />
      <button class="btn btn-primary" onClick={sendChat}>
        送信
      </button>
    </div>
  )
}

export default ChatInput
