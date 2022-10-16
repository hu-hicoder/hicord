import type { Component } from 'solid-js'
import { TalkBoxInfo } from '../../utils/boxes/talk'
import RoomBox from './RoomBox'

const TalkBox: Component<{ info: TalkBoxInfo }> = (props) => {
  return (
    <RoomBox boxInfo={props.info} class="talk-box">
      <div />
    </RoomBox>
  )
}

export default TalkBox
