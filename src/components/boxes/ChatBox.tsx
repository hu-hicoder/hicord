import { createMemo, For } from 'solid-js'
import type { Component } from 'solid-js'
// import ChatInput from './ChatInput'
import { DateTime } from 'luxon'
import { getChatInfos, ChatBoxInfo } from '../../utils/boxes/chat'
import ChatInput from '../toolbars/ChatInput'
import RoomBox from './RoomBox'

const ChatBox: Component<{ info: ChatBoxInfo }> = (props) => {
  const getIdChats = createMemo(() => {
    const chats = getChatInfos().filter(
      (c) => c.chatGroup === props.info.chatGroup
    )
    chats.sort((a, b) => {
      const dateA = a.date
      const dateB = b.date
      if (dateA < dateB) {
        return 1
      }
      if (dateA > dateB) {
        return -1
      }

      return 0
    })

    return chats
  })

  return (
    <RoomBox boxInfo={props.info} class="chat-box">
      <div class="grow space-y-1 overflow-y-scroll box-scrollbar">
        <For each={getIdChats()}>
          {(chatInfo) => (
            <div class="flex flex-row">
              <div class="mr-2">{chatInfo.userName}</div>

              <div class="grow">{chatInfo.value}</div>
              <div>{DateTime.fromJSDate(chatInfo.date).toFormat('HH:mm')}</div>
            </div>
          )}
        </For>
      </div>

      <div>
        <ChatInput chatGroup={props.info.chatGroup} />
      </div>
    </RoomBox>
  )
}

export default ChatBox
