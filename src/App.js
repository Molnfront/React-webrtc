import "video.js/dist/video-js.min.css";
import videojs from "video.js";
import uniqid from "uniqid";
import RecordRTC from "recordrtc";
import "@shivam123425/videojs-record/dist/css/videojs.record.css";
import "@shivam123425/videojs-record/dist/videojs.record.js";
import "./styles.css";
import { useEffect, useRef } from "react";
import { initialise, startRecord, stopRecord } from "./mediasoup/index";

var options = {
  controls: true,
  bigPlayButton: false,
  width: 1920,
  height: 1080,
  fluid: true,
  plugins: {
    record: {
      audio: true,
      video: { facingMode: "environment" },
      maxLength: 2 * 60 * 60,
      displayMilliseconds: false,
      debug: true
    }
  }
};

export default function App() {
  const playerRef = useRef(null);

  function initPlayer() {
    return videojs("myVideo", options, function () {
      // print version information at startup
      var msg =
        "Using video.js " +
        videojs.VERSION +
        " with videojs-record " +
        videojs.getPluginVersion("record") +
        " and recordrtc " +
        RecordRTC.version;
      videojs.log(msg);
    });
  }

  const onDeviceReady = (player) => (_, mediaStream) => {
    console.log("Device ready");
    setTimeout(() => {
      // const videoPlayer = document
      //   .querySelector("#myVideo")
      //   .getElementsByTagName("video")[0];
      // window.videoPlayer = videoPlayer;
      // console.log(videoPlayer);
      // const stream = videoPlayer.captureStream
      //   ? videoPlayer.captureStream()
      //   : undefined;
      // initialise(stream);
      // const webRTCStream = mediaStream.clone();
      // console.log({ webRTCStream });
      // initialise(webRTCStream);
      console.log("Not initialising");
    }, 2000);
  };

  const onFinishRecording = (player) => () => {
    console.log("finished recording");
    const currentDate = new Date();
    stopRecord();
    player.record().saveAs({
      video: `game_recording_${currentDate.toLocaleDateString()}_${uniqid()}`
    });
  };

  function attachEventHandlers(player) {
    // enumerate devices once
    player.one("deviceReady", onDeviceReady(player));

    // error handling
    player.on("deviceError", function () {
      console.log("device error:", player.deviceErrorCode);
    });

    player.on("error", function (element, error) {
      console.error(error);
    });

    // user clicked the record button and started recording
    player.on("startRecord", function () {
      console.log("started recording!");
      // startRecord();
      console.log("Not starting");
    });

    // user completed recording
    player.on("finishRecord", onFinishRecording(player));
  }

  useEffect(() => {
    playerRef.current = initPlayer();

    // Handlers
    attachEventHandlers(playerRef.current);

    return () => {
      playerRef.current.dispose();
    };
  }, []);

  return (
    <div className="App">
      <div>
        <video id="myVideo" playsInline className="video-js vjs-default-skin" />
      </div>
    </div>
  );
}
