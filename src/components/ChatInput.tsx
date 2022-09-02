import type { Component } from 'solid-js'
import { sendChatInfoToAll } from '../utils/sendChatInfo'

const ChatInput: Component<{ chatId: number }> = (props) => {
  let chatRef: HTMLInputElement

  function sendChat() {
    sendChatInfoToAll({ chatId: props.chatId, value: chatRef.value })
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
