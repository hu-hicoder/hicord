/* eslint-disable solid/prefer-for */
import { createMemo, createEffect } from 'solid-js'
import type { Component } from 'solid-js'
import { For } from 'solid-js'
// import ChatInput from './ChatInput'
import { getChatInfos } from '../utils/chat'
import { BoxInfo } from '../utils/box'
import { DateTime } from 'luxon'
const ChatBox: Component<{ chatId: number; boxInfo: BoxInfo }> = (props) => {
  let divRef: HTMLDivElement

  createEffect(() => {
    divRef.style.left = `${props.boxInfo.x}px`
    divRef.style.top = `${props.boxInfo.y}px`
    divRef.style.width = `${props.boxInfo.width}px`
    divRef.style.height = `${props.boxInfo.height}px`
  })

  const getIdChats = createMemo(() =>
    getChatInfos().filter((c) => c.chatId === props.chatId)
  )

  return (
    <div ref={divRef} class="absolute bg-orange-100 rounded-lg p-4">
      <div class="space-y-1">
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
    </div>
  )
}

export default ChatBox
