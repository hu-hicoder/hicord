/* eslint-disable solid/prefer-for */
import { createMemo, For } from 'solid-js'
import type { Component } from 'solid-js'
// import ChatInput from './ChatInput'
import { getChatInfos, ChatBoxInfo } from '../../utils/boxes/chat'
import { DateTime } from 'luxon'
import ChatInput from '../ChatInput'
import RoomBox from './RoomBox'

const ChatBox: Component<{ info: ChatBoxInfo }> = (props) => {
  const getIdChats = createMemo(() =>
    getChatInfos().filter((c) => c.chatGroup === props.info.chatGroup)
  )

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
