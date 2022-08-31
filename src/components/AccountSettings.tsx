import { createSignal } from 'solid-js'
import { localUserInfo, setLocalUserInfo } from '../utils/user'
import { sendLocalUserNameToAll } from '../utils/sendLocalUserName'
import { sendLocalUserAvatarToAll } from '../utils/sendLocalUserAvatar'
const EditProfile = () => {
  let nameElement: HTMLInputElement
  let avatarElement: HTMLInputElement

  function updateProfile() {
    if (localUserInfo().userName !== nameElement.value) {
      setLocalUserInfo((preInfo) => ({
        ...preInfo,
        userName: nameElement.value,
      }))
      sendLocalUserNameToAll()
    }
    if (avatarElement.files.length === 1) {
      const file = avatarElement.files.item(0)
      setLocalUserInfo((preInfo) => ({
        ...preInfo,
        image: file,
      }))
      sendLocalUserAvatarToAll()
      console.log('send user avatar')
    }
  }

  return (
    <div>
      <label for="edit-profile-modal" class="dd-item">
        <span class="material-symbols-outlined mr-3">person</span>
        プロフェールの編集
      </label>

      <input type="checkbox" id="edit-profile-modal" class="modal-toggle" />
      <label for="edit-profile-modal" class="modal cursor-pointer">
        <label class="modal-box relative text-black" for="">
          <label
            for="edit-profile-modal"
            class="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 class="text-lg font-bold">プロフィールの編集</h3>
          {/* Form */}
          <div class="space-y-4 mx-2">
            {/* User Name */}
            <div class="form-control w-full">
              <label class="label">
                <span class="label-text">ユーザ名</span>
              </label>
              <input
                type="text"
                ref={nameElement}
                class="input input-bordered"
                value={localUserInfo() ? localUserInfo().userName : 'No Name'}
              />
            </div>
            {/* User Avatar */}
            <div class="form-control w-full max-w-xs">
              <label class="label">
                <span class="label-text">アバター</span>
              </label>
              <input type="file" ref={avatarElement} />
            </div>
          </div>
          <div class="modal-action">
            <label for="edit-profile-modal" class="btn" onClick={updateProfile}>
              更新
            </label>
          </div>
        </label>
      </label>
    </div>
  )
}

const AccountSettings = () => {
  const [getShowModal, setShowModal] = createSignal(false)

  return (
    <div>
      <span
        class="material-symbols-outlined tb-item"
        onClick={() => setShowModal((prev) => !prev)}
      >
        account_circle
      </span>
      {getShowModal() ? (
        <div class="fixed right-8 top-16 mt-5 p-2 tb-card tb-bg rounded-lg w-52 flex-col">
          <EditProfile />
          <div class="dd-item">
            <span class="material-symbols-outlined mr-3">login</span>
            ログイン
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default AccountSettings
