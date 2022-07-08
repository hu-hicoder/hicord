import Peer, { DataConnection, SfuRoom } from "skyway-js";
import type { Component } from "solid-js";
import { createEffect, createSignal, For } from "solid-js";
import LocalUserIcon from "./LocalUserIcon";
import {
  localUserInfo,
  setLocalUserInfo,
  remoteUserInfos,
  setRemoteUserInfos,
  UserCoord,
  UserInfo,
} from "../utils/user";
import RemoteUserIcon from "./RemoteUserIcon";

const KEY = import.meta.env.VITE_SKY_WAY_API_KEY;
export const PEER = new Peer({ key: KEY as string });

const ROOM_X = 2048;
const ROOM_Y = 2048;

export const Room: Component<{ roomId: string }> = ({ roomId }) => {
  // Local
  const [localStream, setLocalStream] = createSignal<MediaStream>();
  // Room
  const [room, setRoom] = createSignal<SfuRoom>();
  const [isStarted, setIsStarted] = createSignal(false);
  createEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const onStart = () => {
    if (PEER) {
      if (!PEER.open) {
        return;
      }
      if (localStream() === undefined) {
        return;
      }
      setLocalUserInfo({
        stream: localStream(),
        peerId: PEER.id,
        x: ROOM_X / 2,
        y: ROOM_Y / 2,
        deg: 0,
      });
      const tmpRoom = PEER.joinRoom<SfuRoom>(roomId, {
        mode: "sfu",
        stream: localStream(),
      });
      tmpRoom.once("open", () => {
        console.log("=== あなたが参加しました ===\n");
      });
      tmpRoom.on("peerJoin", (peerId) => {
        console.log(`=== ${peerId} が入室しました ===\n`);
      });
      tmpRoom.on("stream", async (stream) => {
        const remoteUserInfo = {
          stream: stream,
          peerId: stream.peerId,
          x: ROOM_X / 2,
          y: ROOM_Y / 2,
          deg: 0,
        };
        // if (localUserInfo) {
        //   audioProcessing(localUserInfo, remoteUserInfo)
        // }
        setRemoteUserInfos((prev) => [...prev, remoteUserInfo]);
      });
      tmpRoom.on("peerLeave", (peerId) => {
        setRemoteUserInfos((prev) => {
          return prev.filter((userInfo) => {
            if (userInfo.peerId === peerId) {
              userInfo.stream.getTracks().forEach((track) => track.stop());
            }
            return userInfo.peerId !== peerId;
          });
        });
        console.log(`=== ${peerId} が退出しました ===\n`);
      });
      setRoom(tmpRoom);
      // DataConnection
      PEER.on("connection", (dataConnection) => {
        dataConnection.on("data", (data) => {
          console.log(data);
          const userCoord = data as UserCoord;
          setRemoteUserInfos((prev) => {
            return prev.map((userInfo) => {
              if (userInfo.peerId === dataConnection.remoteId) {
                return {
                  ...userInfo,
                  x: userCoord.x,
                  y: userCoord.y,
                  deg: userCoord.deg,
                } as UserInfo;
              }
              return userInfo;
            });
          });
        });
      });
    }
    setIsStarted((prev) => !prev);
  };
  const onEnd = () => {
    if (room()) {
      room().close();
      setRemoteUserInfos((prev) => {
        return prev.filter((userInfo) => {
          userInfo.stream.getTracks().forEach((track) => track.stop());
          return false;
        });
      });
    }
    setLocalUserInfo();
    setIsStarted((prev) => !prev);
    console.log("=== あなたが退出しました ===\n");
  };

  return (
    <div>
      <div
        class="relative bg-orange-100"
        style={{ height: `${ROOM_X}px`, width: `${ROOM_Y}px` }}
      >
        {/* buttons */}
        <button
          class="sticky top-0 left-0"
          onClick={() => onStart()}
          disabled={isStarted()}
        >
          開始
        </button>
        <button
          class="sticky top-0 left-8"
          onClick={() => onEnd()}
          disabled={!isStarted()}
        >
          停止
        </button>
        {/* Remote User Icons */}
        <For each={remoteUserInfos()}>
          {(info) => <RemoteUserIcon info={info} />}
        </For>
        {/* Local User Icon */}
        {localUserInfo() ? <LocalUserIcon /> : null}
      </div>
    </div>
  );
};
