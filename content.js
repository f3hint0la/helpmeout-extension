console.log("This is Content.js");

var recorder = null;
var recordedChunks = [];

// starts recording when access has been approved
const onAccessApproved = (stream) => {
  recorder = new MediaRecorder(stream);
  recorder.start();

  // stops recording when the function is called
  recorder.onstop = function () {
    stream.getTracks().forEach((track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
  };

  const fetchBlob = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64 = await convertBlobToBase64(blob);

    return base64;
  };

  //   converts blob to base64
  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;

        resolve(base64data);
      };
    });
  };

  // we handle the recorded data and covert it from a blob to base64 for easy storage
  recorder.ondataavailable = async function (event) {
    let recordedBlob = event.data;
    let url = URL.createObjectURL(recordedBlob);

    let a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "screen_recording.webm";
    document.body.appendChild(a);

    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };
};

const sendChunkToBackend = (chunkData) => {
  console.log("video", chunkData);
};

// listens for when the record button is click and a recording request is sent
var port = chrome.runtime.connect();
port.onMessage.addListener((message, sender, sendResponse) => {
  console.log(sender.tab);
  if (message.action === "request_recording") {
    console.log("requesting recording...");
    sendResponse(`processed ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 99999999999,
          height: 99999999999,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  if (message.action === "stopvideo") {
    console.log("Stopping Video");

    sendResponse(`processed: ${message.action}`);
    if (!recorder) {
      return console.log("No Video");
    }

    recorder.stop();
  }

  if (message.action === "paused") {
    console.log("Recording paused");

    sendResponse(`processed: ${message.action}`);
    recorder.pause();
  }
});
