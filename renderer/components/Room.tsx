import Peer, { SfuRoom } from "skyway-js";
import React from "react";
// import { SKYWAYAPI } from ".env"; // TODO Create env file
const SKYWAYAPI = "test";

type VideoStream = {
  stream: MediaStream;
  peerId: string;
};

export const Room: React.VFC<{ roomId: string }> = ({ roomId }) => {
  const peer = React.useRef(new Peer({ key: SKYWAYAPI as string }));
  const [remoteVideo, setRemoteVideo] = React.useState<VideoStream[]>([]);
  const [localStream, setLocalStream] = React.useState<MediaStream>();
  const [room, setRoom] = React.useState<SfuRoom>();
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch((e) => console.log(e));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  const onStart = () => {
    if (peer.current) {
      if (!peer.current.open) {
        return;
      }
      const tmpRoom = peer.current.joinRoom<SfuRoom>(roomId, {
        mode: "sfu",
        stream: localStream,
      });
      tmpRoom.once("open", () => {
        console.log("=== You joined ===\n");
      });
      tmpRoom.on("peerJoin", (peerId) => {
        console.log(`=== ${peerId} joined ===\n`);
      });
      tmpRoom.on("stream", async (stream) => {
        setRemoteVideo([
          ...remoteVideo,
          { stream: stream, peerId: stream.peerId },
        ]);
      });
      tmpRoom.on("peerLeave", (peerId) => {
        setRemoteVideo(
          remoteVideo.filter((video) => {
            if (video.peerId === peerId) {
              video.stream.getTracks().forEach((track) => track.stop());
            }
            return video.peerId !== peerId;
          })
        );
        console.log(`=== ${peerId} left ===\n`);
      });
      setRoom(tmpRoom);
    }
  };
  const onEnd = () => {
    if (room) {
      room.close();
      setRemoteVideo((prev) => {
        return prev.filter((video) => {
          video.stream.getTracks().forEach((track) => track.stop());
          return false;
        });
      });
    }
  };
  const castVideo = () => {
    return remoteVideo.map((video) => {
      return <RemoteVideo video={video} key={video.peerId} />;
    });
  };
  return (
    <div>
      <button onClick={() => onStart()}>start</button>
      <button onClick={() => onEnd()}>end</button>
      <video ref={localVideoRef} playsInline></video>
      {castVideo()}
    </div>
  );
};

const RemoteVideo = (props: { video: VideoStream }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.video.stream;
      videoRef.current.play().catch((e) => console.log(e));
    }
  }, [props.video]);
  return <video ref={videoRef} playsInline></video>;
};