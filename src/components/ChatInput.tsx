import type { Component } from 'solid-js'
import { sendChatInfoToAll } from '../utils/sendChatInfo'
import { setChatInfos, localChatInfoFrom } from '../utils/chat'

const ChatInput: Component<{ chatGroup: number }> = (props) => {
  let chatRef: HTMLInputElement

  function sendChat() {
    const chatInfo = localChatInfoFrom({
      chatGroup: props.chatGroup,
      value: chatRef.value,
    })
    sendChatInfoToAll(chatInfo)
    setChatInfos((prev) => [...prev, chatInfo])
    chatRef.value = ''
  }

  return (
    <div class="flex flex-row items-center gap-1.5">
      <input
        ref={chatRef}
        type="text"
        class="grow rounded-md p-1 bg-gray-100"
        placeholder="Chat"
      />

      <span
        class="material-symbols-outlined cursor-pointer text-blue-700"
        onClick={sendChat}
      >
        send
      </span>
    </div>
  )
}

export default ChatInput
