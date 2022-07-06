import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import UserIcon, {USER_ICON_X, USER_ICON_Y} from './UserIcon'
import { UserInfo } from '../utils/user'

export const [localUserInfo, setLocalUserInfo] = createSignal<UserInfo>()

const LocalUserIcon: Component = () => {
  let localDiv;

// mouse down
function mdown(e) {
  console.log(`mouse down`)
  // mouse and touch event
  if(e.type === "mousedown") {
      var event = e;
  } else {
      var event = e.changedTouches[0];
  }

  // add move event
  document.body.addEventListener("mousemove", mmove, false);
  document.body.addEventListener("touchmove", mmove, false);
}

// mouse move
function mmove(e) {
  // mouse and touch event
  if(e.type === "mousemove") {
      var event = e;
  } else {
      var event = e.changedTouches[0];
  }

  // prevent
  e.preventDefault();

  // set info
  setLocalUserInfo((prev) =>{ 
    if (prev) {
      const x = event.pageX - USER_ICON_X / 2
      const y = event.pageY - USER_ICON_Y / 2

      const dx = x - prev.x
      const dy = y - prev.y
      let deg = prev.deg
      if (5< Math.abs(dx) || 5 < Math.abs(dy)) {
        let r = Math.atan2(dy, dx)
        if (r < 0) {
          r = r + 2 * Math.PI
        }
        deg = Math.floor(r * 360 / (2 * Math.PI)) - 90
      }

      return {
        ...prev,
        x: x,
        y: y,
        deg: deg,
    }
  }
    return prev
})

  // add mouse up event
  localDiv.addEventListener("mouseup", mup, false);
  document.body.addEventListener("mouseleave", mup, false);
  localDiv.addEventListener("touchend", mup, false);
  document.body.addEventListener("touchleave", mup, false);

}

// mouse up
function mup(e) {
  console.log(`mouse up`)
  // delete move event
  document.body.removeEventListener("mousemove", mmove, false);
  localDiv.removeEventListener("mouseup", mup, false);
  document.body.removeEventListener("touchmove", mmove, false);
  localDiv.removeEventListener("touchend", mup, false);
}


  return (
    <UserIcon info={localUserInfo()}>
      <div ref={localDiv} onMouseDown={mdown} class="w-full h-full cursor-grab">

      </div>
    </UserIcon>
  )
}

export default LocalUserIcon