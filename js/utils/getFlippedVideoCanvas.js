export function getFlippedVideoCanvas(video) {
  const frameCanvas = document.createElement("canvas");
  frameCanvas.width = 320;
  frameCanvas.height = 240;
  const frameCtx = frameCanvas.getContext("2d");
  frameCtx.translate(frameCanvas.width, 0);
  frameCtx.scale(-1, 1);
  frameCtx.drawImage(video, 0, 0);
  return frameCanvas;
}
