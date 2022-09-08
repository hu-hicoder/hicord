import AccountSettings from './AccountSettings'
import { onEnd } from '../utils/room'

const UserToolbar = () => {
  return (
    <div class="fixed sm:right-6 sm:top-6 right-4 top-4 tb-card">
      <span class="material-symbols-outlined tb-item">settings</span>
      <AccountSettings />
      <span class="material-symbols-outlined tb-item" onClick={onEnd}>
        logout
      </span>
    </div>
  )
}

export default UserToolbar
