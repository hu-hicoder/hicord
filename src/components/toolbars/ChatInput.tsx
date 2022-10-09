/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Component } from 'solid-js'
import { sendChatInfoToAll } from '../../utils/send/sendChatInfo'
import { setChatInfos, localChatInfoFrom } from '../../utils/boxes/chat'

const ChatInput: Component<{ chatGroup: number }> = (props) => {
  let chatRef: HTMLInputElement | undefined

  function sendChat() {
    const localChatInfo = localChatInfoFrom({
      chatGroup: props.chatGroup,
      value: chatRef!.value,
    })
    if (localChatInfo === undefined) return
    sendChatInfoToAll(localChatInfo)
    setChatInfos((prev) => [...prev, localChatInfo])
    chatRef!.value = ''
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
