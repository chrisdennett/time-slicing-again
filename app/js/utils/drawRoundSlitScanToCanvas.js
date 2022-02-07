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
  });

  if (!drawSlice) return;

  // drawSliceMovingAwayFromMiddle({
  //   ctx,
  //   target,
  //   liveWebcamSectionH,
  //   sliceSize: sliceSizeInt,
  // });
}

//
// AT TOP MOVING DOWN
//

//
// IN MIDDLE MOVING UP and DOWN
//

function drawLiveWebcamSectionInMiddle({
  target,
  src,
  isReflected,
  srcSectionH,
  liveWebcamSectionH,
  sliceSize,
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

  // draw the dest to itself 1 pixel bigger offset by one pixel

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

  const radius = dest.h / 2;
  const centerX = dest.w / 2;
  const centerY = dest.y + radius;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.drawImage(
    src,
    source.x,
    source.y,
    source.w,
    source.h,
    dest.x,
    dest.y,
    dest.w,
    dest.h
  );
  ctx.restore();

  // draw the left to the right, but flipped
  if (isReflected) {
    const halfW = dest.w / 2;

    ctx.save();
    ctx.translate(halfW * 2, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(
      target,
      dest.x,
      dest.y,
      dest.w / 2,
      dest.h,
      dest.x,
      dest.y,
      halfW,
      dest.h
    );
    ctx.restore();
  }
}

function drawSliceMovingAwayFromMiddle({
  ctx,
  target,
  liveWebcamSectionH,
  sliceSize,
}) {
  // moving up
  const middleY = target.height / 2;
  const halfSectionH = liveWebcamSectionH / 2;
  const topOfSection = middleY - halfSectionH;
  const heightToShiftUp = topOfSection + sliceSize;

  const from = {
    x: 0,
    y: 0,
    w: target.width,
    h: heightToShiftUp,
  };
  const to = {
    x: 0,
    y: -sliceSize,
    w: target.width,
    h: heightToShiftUp,
  };

  ctx.drawImage(target, from.x, from.y, from.w, from.h, to.x, to.y, to.w, to.h);

  // moving down
  const bottomOfSection = middleY + halfSectionH;
  const heightToShiftDown = target.height - bottomOfSection + sliceSize;
  const from2 = {
    x: 0,
    y: bottomOfSection - sliceSize,
    w: target.width,
    h: heightToShiftDown,
  };
  const to2 = {
    x: 0,
    y: bottomOfSection,
    w: target.width,
    h: heightToShiftDown,
  };

  ctx.drawImage(
    target,
    from2.x,
    from2.y,
    from2.w,
    from2.h,
    to2.x,
    to2.y,
    to2.w,
    to2.h
  );
}