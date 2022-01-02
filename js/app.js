import { drawSlitScanToCanvas } from "./utils/drawSlitScanToCanvas.js";
import { drawVerticalSlitScanToCanvas } from "./utils/drawVerticalSlitScanToCanvas.js";
import { getFlippedVideoCanvas } from "./utils/getFlippedVideoCanvas.js";

// elements
const artCanvas = document.querySelector("#artCanvas");
const artCanvas2 = document.querySelector("#artCanvas2");
const video = document.querySelector("#videoElement");
const isReflectedCheckbox = document.querySelector("#isReflectedCheckbox");
const isHorizontalCheckbox = document.querySelector("#isHorizontalCheckbox");
const webcamAtStartCheckbox = document.querySelector("#webcamAtStartCheckbox");
const sliceSizeSlider = document.querySelector("#sliceSizeSlider");
const canvasSizeSlider = document.querySelector("#canvasSizeSlider");
const msPerFrameSlider = document.querySelector("#msPerFrameSlider");
const scanStartPos = document.querySelector("#scanStartPos");
const scanStartPosValue = document.querySelector("#scanStartPosValue");
const isReflectedCheckboxValue = document.querySelector(
  "#isReflectedCheckboxValue"
);
const sliceSizeSliderValue = document.querySelector("#sliceSizeSliderValue");
const msPerFrameSliderValue = document.querySelector("#msPerFrameSliderValue");
const isHorizontalCheckboxValue = document.querySelector(
  "#isHorizontalCheckboxValue"
);
const webcamAtStartCheckboxValue = document.querySelector(
  "#webcamAtStartCheckboxValue"
);
const canvasSizeSliderValue = document.querySelector("#canvasSizeSliderValue");

// global defaults
let sliceStartPos = 1;
let sliceSize = 3;
let msPerFrame = 1;
let lastDrawTime = null;
let canvasSize = 350;
let isReflected = false;
let isHorizontal = true;
let webcamAtStart = true;

// set up controls, webcam etc
export function setup() {
  setupControls();
  setupWebcam();
}

function setupControls() {
  // show defaults on controls
  isReflectedCheckbox.checked = isReflected;
  webcamAtStartCheckbox.checked = webcamAtStart;
  isHorizontalCheckbox.checked = isHorizontal;
  sliceSizeSlider.value = sliceSize;
  msPerFrameSlider.value = msPerFrame;
  scanStartPos.value = sliceStartPos;
  canvasSizeSlider.value = canvasSize;

  scanStartPosValue.innerHTML = sliceStartPos;
  isReflectedCheckboxValue.innerHTML = isReflected;
  sliceSizeSliderValue.innerHTML = sliceSize;
  msPerFrameSliderValue.innerHTML = msPerFrame;
  canvasSizeSliderValue.innerHTML = canvasSize;
  isHorizontalCheckboxValue.innerHTML = isHorizontal
    ? "(is horizontal)"
    : "(is vertical)";
  webcamAtStartCheckboxValue.innerHTML = webcamAtStart
    ? "(is at start)"
    : "(is at end)";

  // listeners
  isReflectedCheckbox.addEventListener("input", onIsReflectedCheckboxChange);
  isHorizontalCheckbox.addEventListener("input", isHorizontalCheckboxChange);
  webcamAtStartCheckbox.addEventListener("input", webcamAtStartCheckboxChange);
  sliceSizeSlider.addEventListener("input", onsliceSizeSliderChange);
  msPerFrameSlider.addEventListener("input", onMsPerFrameSliderChange);
  scanStartPos.addEventListener("input", onscanStartPos);
  canvasSizeSlider.addEventListener("input", onCanvasSizeSliderChange);

  // functions
  function onCanvasSizeSliderChange(e) {
    canvasSize = e.target.value;
    canvasSizeSliderValue.innerHTML = canvasSize;
  }
  function onscanStartPos(e) {
    sliceStartPos = e.target.value;
    scanStartPosValue.innerHTML = sliceStartPos;
  }
  function onIsReflectedCheckboxChange(e) {
    isReflected = e.target.checked;
    isReflectedCheckboxValue.innerHTML = isReflected;
  }
  function isHorizontalCheckboxChange(e) {
    isHorizontal = e.target.checked;
    isHorizontalCheckboxValue.innerHTML = isHorizontal
      ? "(is horizontal)"
      : "(is vertical)";
  }
  function webcamAtStartCheckboxChange(e) {
    webcamAtStart = e.target.checked;
    webcamAtStartCheckboxValue.innerHTML = webcamAtStart
      ? "(is at start)"
      : "(is at end)";
  }
  function onsliceSizeSliderChange(e) {
    sliceSize = e.target.value;
    sliceSizeSliderValue.innerHTML = sliceSize;
  }
  function onMsPerFrameSliderChange(e) {
    msPerFrame = e.target.value;
    msPerFrameSliderValue.innerHTML = msPerFrame;
  }
}

function setupWebcam() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 1280, height: 720 },
      })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (error) {
        console.log("video error: ", error);
      });
  }
}

// draw loop
export function draw() {
  const timeStamp = Date.now();

  let drawSlice = false;

  if (!lastDrawTime || timeStamp - lastDrawTime >= msPerFrame) {
    lastDrawTime = timeStamp;
    drawSlice = true;
  }

  const frameCanvas = getFlippedVideoCanvas(video);

  if (isHorizontal) {
    drawHorizontalSlitScan(frameCanvas, drawSlice, webcamAtStart);
    if (artCanvas2.style.display !== "none") {
      artCanvas2.style.display = "none";
    }
    if (artCanvas.style.display === "none") {
      artCanvas.style.display = "inherit";
    }
  } else {
    drawVerticalSlitScan(frameCanvas, drawSlice, webcamAtStart);
    if (artCanvas.style.display !== "none") {
      artCanvas.style.display = "none";
    }
    if (artCanvas2.style.display === "none") {
      artCanvas2.style.display = "inherit";
    }
  }

  window.requestAnimationFrame(draw);
}

function drawHorizontalSlitScan(frameCanvas, drawSlice, webcamAtStart) {
  const canvasWidth = document.body.clientWidth - 40;

  if (
    artCanvas.width !== canvasWidth ||
    artCanvas.height !== parseInt(canvasSize)
  ) {
    artCanvas.height = canvasSize;
    artCanvas.width = canvasWidth;
  }

  drawSlitScanToCanvas({
    src: frameCanvas,
    target: artCanvas,
    sliceSize,
    isReflected,
    drawSlice,
    sliceStartPos,
    webcamAtStart,
  });
}

function drawVerticalSlitScan(frameCanvas, drawSlice, webcamAtStart) {
  const canvasHeight = document.body.clientHeight - 40;

  if (
    artCanvas2.height !== canvasHeight ||
    artCanvas2.width !== parseInt(canvasSize)
  ) {
    artCanvas2.height = canvasHeight;
    artCanvas2.width = canvasSize;
  }

  drawVerticalSlitScanToCanvas({
    src: frameCanvas,
    target: artCanvas2,
    sliceSize,
    isReflected,
    drawSlice,
    sliceStartPos,
    webcamAtStart,
  });
}
