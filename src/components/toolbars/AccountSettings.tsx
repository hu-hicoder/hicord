/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createSignal } from 'solid-js'
import { localUserInfo, setLocalUserInfo } from '../../utils/user'
import { sendLocalUserNameToAll } from '../../utils/send/sendLocalUserName'
import {
  sendLocalUserAvatarToAll,
  sendLocalUserOriginalAvatarToAll,
} from '../../utils/send/sendLocalUserAvatar'

const EditProfile = () => {
  let nameElement: HTMLInputElement | undefined
  let mainColorRef: HTMLInputElement | undefined
  let subColor1Ref: HTMLInputElement | undefined
  let subColor2Ref: HTMLInputElement | undefined
  let avatarElement: HTMLInputElement | undefined

  function updateProfile() {
    const _localUserInfo = localUserInfo()
    if (_localUserInfo === undefined) return

    if (_localUserInfo.userName !== nameElement!.value) {
      setLocalUserInfo((preInfo) => {
        if (preInfo === undefined) return
        return {
          ...preInfo,
          userName: nameElement!.value,
        }
      })
      sendLocalUserNameToAll()
      localStorage.setItem('localUserName', nameElement!.value)
    }
    if (
      _localUserInfo.mainColor !== mainColorRef!.value ||
      _localUserInfo.subColor1 !== subColor1Ref!.value ||
      _localUserInfo.subColor2 !== subColor2Ref!.value
    ) {
      setLocalUserInfo((preInfo) => {
        if (preInfo === undefined) return
        return {
          ...preInfo,
          mainColor: mainColorRef!.value,
          subColor1: subColor1Ref!.value,
          subColor2: subColor2Ref!.value,
        }
      })
      sendLocalUserAvatarToAll()
    }
    if (avatarElement!.files?.length === 1) {
      const file = avatarElement!.files.item(0)
      if (file !== null) {
        setLocalUserInfo((preInfo) => {
          if (preInfo === undefined) return
          return {
            ...preInfo,
            originalImage: file,
          }
        })
        sendLocalUserOriginalAvatarToAll()
        console.log('send user original avatar')
      }
    }
  }

  return (
    <div>
      <label for="edit-profile-modal" class="dd-item">
        <span class="material-symbols-outlined mr-3">person</span>
        プロフィールの編集
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
                value={localUserInfo()?.userName ?? 'No Name'}
              />
            </div>
            {/* User Avatar */}
            <div>
              <div class="text-lg font-bold">アバター</div>
              <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text">メインカラー</span>
                </label>
                <input
                  type="color"
                  ref={mainColorRef}
                  value={localUserInfo()?.mainColor ?? '#ffffff'}
                />
              </div>
              <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text">サブカラー１</span>
                </label>
                <input
                  type="color"
                  ref={subColor1Ref}
                  value={localUserInfo()?.subColor1 ?? '#ffffff'}
                />
              </div>
              <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text">サブカラー２</span>
                </label>
                <input
                  type="color"
                  ref={subColor2Ref}
                  value={localUserInfo()?.subColor2 ?? '#ffffff'}
                />
              </div>
              {/* User Original Avatar */}
              <div class="form-control w-full max-w-xs">
                <label class="label">
                  <span class="label-text">オリジナルアイコン</span>
                </label>
                <input type="file" ref={avatarElement} accept="image/*" />
              </div>
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
