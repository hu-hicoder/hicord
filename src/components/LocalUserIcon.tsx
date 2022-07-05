import type { Component } from 'solid-js';
import UserIcon from './UserIcon'
import { UserInfo } from '../utils/user'

const LocalUserIcon: Component<{ info: UserInfo }> = ({ info }) => {
  return (
    <UserIcon info={info} />
  )
}

export default LocalUserIcon