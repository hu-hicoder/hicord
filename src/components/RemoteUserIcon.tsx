import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { audioProcessing } from "../utils/audio";
import UserIcon from "./UserIcon";
import { UserInfo } from "../utils/user";

const RemoteUserIcon: Component<{ info: UserInfo }> = ({ info }) => {
  const videoRef: HTMLVideoElement = null;

  createEffect(() => {
    // Audio processing
    audioProcessing(
      {
        stream: info.stream,
        peerId: info.peerId,
        x: 2048 / 2,
        y: 2048 / 2,
        deg: 0,
      },
      info
    );
    // Set stream to video element
    videoRef.srcObject = info.stream;
    videoRef.play().catch((e) => console.log(e));
  }, [info]);
  return (
    <UserIcon info={info}>
      <video ref={videoRef} playsinline controls></video>
    </UserIcon>
  );
};

export default RemoteUserIcon;
