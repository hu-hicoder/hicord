/* eslint-disable solid/prefer-for */
import { createMemo, createEffect } from 'solid-js'
import type { Component } from 'solid-js'
import { For } from 'solid-js'
// import ChatInput from './ChatInput'
import { getChatInfos, ChatBoxInfo } from '../utils/chat'
import { DateTime } from 'luxon'
import createResizeObserver from '../utils/resize'
import ChatInput from './ChatInput'

const ChatBox: Component<{ chatBoxInfo: ChatBoxInfo }> = (props) => {
  let divRef: HTMLDivElement

  createEffect(() => {
    divRef.style.left = `${props.chatBoxInfo.x}px`
    divRef.style.top = `${props.chatBoxInfo.y}px`
    divRef.style.width = `${props.chatBoxInfo.width}px`
    divRef.style.height = `${props.chatBoxInfo.height}px`
  })

  const getIdChats = createMemo(() =>
    getChatInfos().filter((c) => c.chatGroup === props.chatBoxInfo.chatGroup)
  )

  createEffect(() => {
    const handleResize = (entries: ResizeObserverEntry[]) => {
      const width = entries[0].target.clientWidth
      const height = entries[0].target.clientHeight
    }

    createResizeObserver([divRef], handleResize)
  })

  return (
    <div
      ref={divRef}
      class="room-box chat-box rounded-lg p-4 flex flex-col gap-2"
    >
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
        <ChatInput chatGroup={props.chatBoxInfo.chatGroup} />
      </div>
    </div>
  )
}

export default ChatBox
