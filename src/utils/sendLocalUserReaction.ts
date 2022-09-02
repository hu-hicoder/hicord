import { RemoteUserInfo, UserReaction } from './user'
import { sendTo, sendToAll } from './send'

export const sendLocalUserReactionToAll = (
  reaction: UserReaction['userReactionURIEncoded']
) => {
  const data: UserReaction = { userReactionURIEncoded: reaction }
  sendToAll(data)
}

export const sendLocalUserReactionTo = (
  reaction: UserReaction['userReactionURIEncoded'],
  remoteUserPeerId: RemoteUserInfo['peerId']
) => {
  const data: UserReaction = { userReactionURIEncoded: reaction }
  sendTo(remoteUserPeerId, data)
}
