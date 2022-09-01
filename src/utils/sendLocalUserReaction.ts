import { RemoteUserInfo, UserReaction } from './user'
import { sendTo, sendToAll } from './send'

export const sendLocalUserReactionToAll = (
  reaction: UserReaction['userReaction']
) => {
  const data: UserReaction = { userReaction: reaction }
  sendToAll(data)
}

export const sendLocalUserReactionTo = (
  reaction: UserReaction['userReaction'],
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const data: UserReaction = { userReaction: reaction }
  sendTo(remoteUserPeerId, data)
}
