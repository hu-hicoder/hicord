import type { ParentComponent } from 'solid-js';
import { UserInfo } from '../utils/user'
export const USER_ICON_X = 128
export const USER_ICON_Y = 128

const UserIcon: ParentComponent<{ info: UserInfo }> = (props) => {
  const info = props.info
  return (
    <div class='absolute bg-blue-600 top-3 left-5' style={{ 'clip-path': 'polygon(0% 0%, 100% 0, 100% 75%, 50% 100%, 0 75%)', height:`${USER_ICON_X}px`, width:`${USER_ICON_Y}px`, top:`${info.x}px`, left:`${info.y}px`, transform: `rotate(${info.deg}deg)` }}>
      { props.children }
    </div>
  )
}

export default UserIcon