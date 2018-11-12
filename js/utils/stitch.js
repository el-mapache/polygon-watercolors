// cool pattern from a codepen example doing the same code!
const makeStitchPattern = (context) => {
  const ctxStitch = document
    .createElement('canvas')
    .getContext('2d');

  const stitchWidth = 5;

  ctxStitch.canvas.width  = stitchWidth;
  ctxStitch.canvas.height = stitchWidth;

  ctxStitch.strokeStyle = `rgba(220, 220, 220, 0.1)`;

  ctxStitch.beginPath();
  ctxStitch.moveTo(0, 0);
  ctxStitch.lineTo(stitchWidth, stitchWidth);
  ctxStitch.stroke();
  ctxStitch.closePath();

  ctxStitch.beginPath();
  ctxStitch.moveTo(0, stitchWidth);
  ctxStitch.lineTo(stitchWidth, 0);
  ctxStitch.stroke();
  ctxStitch.closePath();

  return context.createPattern(ctxStitch.canvas, 'repeat');
};

export default makeStitchPattern;
