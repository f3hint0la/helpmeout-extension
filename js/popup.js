document.addEventListener("DOMContentLoaded", () => {
  let screen = "browser";
  const fullScreen = document.querySelector("#fullscreen");
  const currentTab = document.querySelector("#currenttab");
  const timer = document.querySelector(".timer");
  const pauseBtn = document.querySelector(".pause");
  const stopBtn = document.querySelector(".stop");
  const camera = document.querySelector(".camera");
  const microphone = document.querySelector(".microphone");
  const deleteBtn = document.querySelector(".trash");
  const startRecordingBtn = document.querySelector(".recordBtn");
  const recordActionContainer = document.querySelector(
    ".recordActionContainer"
  );
  const closePopup = document.querySelector(".close");

  closePopup.addEventListener("click", () => {
    window.close();
  });

  fullScreen.addEventListener("click", () => {
    fullScreen.style.opacity = 1;
    currentTab.style.opacity = 0.5;
    screen = "window";
  });

  currentTab.addEventListener("click", () => {
    currentTab.style.opacity = 1;
    fullScreen.style.opacity = 0.5;
    screen = "browser";
  });

  startRecordingBtn.addEventListener("click", () => {
    recordActionContainer.style.display = "flex";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "request_recording" },
        function (response) {
          if (!chrome.runtime.lastError) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError, "Error");
          }
        }
      );
    });
  });
});
