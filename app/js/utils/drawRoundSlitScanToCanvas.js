export function drawRoundSlitScanToCanvas({ src, target, drawSlice, params }) {
  const { scanStartPos, isReflected, sliceSize } = params;
  const sliceSizeInt = parseInt(sliceSize.value);

  const srcSectionH = scanStartPos.value * src.height;
  const scale = target.width / src.width;
  const liveWebcamSectionH = srcSectionH * scale;

  drawLiveWebcamSectionInMiddle({
    src,
    target,
    isReflected: isReflected.value,
    srcSectionH,
    liveWebcamSectionH,
    sliceSize: sliceSizeInt,
    drawSlice,
  });
}

//
// AT TOP MOVING DOWN
//

//
// IN MIDDLE MOVING UP and DOWN
//

function regPolyPath(r, p, ctx) {
  //Radius, #points, context
  //Azurethi was here!
  ctx.moveTo(r, 0);
  for (i = 0; i < p + 1; i++) {
    ctx.rotate((2 * Math.PI) / p);
    ctx.lineTo(r, 0);
  }
  ctx.rotate((-2 * Math.PI) / p);
}

function drawLiveWebcamSectionInMiddle({
  target,
  src,
  srcSectionH,
  liveWebcamSectionH,
  sliceSize,
  drawSlice,
}) {
  const ctx = target.getContext("2d");
  const targMiddle = target.height / 2;
  const halfSection = liveWebcamSectionH / 2;
  const targY = targMiddle - halfSection;

  // remove from top and bottom when cropping source
  const srcMiddle = src.height / 2;
  const halfSrcSection = srcSectionH / 2;
  const srcY = srcMiddle - halfSrcSection;

  // draw live webcam portion of screen
  const source = {
    x: 0,
    y: srcY,
    w: src.width,
    h: srcSectionH,
  };
  const dest = {
    x: 0,
    y: targY,
    w: target.width,
    h: liveWebcamSectionH,
  };

  if (drawSlice) {
    // draw the dest to itself 2 pixel wider and higher offset by one pixel each way
    ctx.drawImage(
      target,
      0,
      0,
      target.width,
      target.height,
      -sliceSize,
      -sliceSize,
      target.width + sliceSize + sliceSize,
      target.height + sliceSize + sliceSize
    );
  }

  const centerX = target.width / 2;
  const centerY = target.height / 2;

  const outputRadius = 100;
  const hToWRatio = src.width / src.height;
  const outputHeight = outputRadius * 2;
  const outputWidth = outputHeight * hToWRatio;
  const outputX = centerX - outputWidth / 2;
  const outputY = centerY - outputHeight / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, outputRadius, 0, Math.PI * 2);
  ctx.clip();

  ctx.drawImage(
    src,
    source.x,
    source.y,
    source.w,
    source.h,
    outputX,
    outputY,
    outputWidth,
    outputHeight
  );
  ctx.restore();
}
