import Shapes from './shapes';
import PointFactory from './point';
import random from './utils/random';
import gaussian from './utils/gaussian';

const ALPHA = .009;
const COLORS = [
  // `hsla(0, 100%, 66%, ${ALPHA})`,
  // `hsla(100, 100%, 70%, ${ALPHA})`,
  // `hsla(204, 100%, 50%, ${ALPHA})`,

  //`hsla(25, 100%, 29%, ${ALPHA})`,
  `rgba(255, 0, 0, ${ALPHA})`,
  `rgba(0, 255, 0, ${ALPHA})`,
  `rgba(0, 0, 255, ${ALPHA})`,
];

const POLYGON = {
  DEPTH: 5,
  VARIANCE: 20,
  VARIANCE_DECREASE: 2,
  POLYGON_COUNT: 200,
  POLYGON_STEP: 2,
  DROPLET_COUNT: 3,
  EDGES: 7,
};

const DROPLET_OFFSET = (Math.PI * 2) / POLYGON.DROPLET_COUNT;

// cool pattern from a codepen example doing the same code!
// const makeStitchPattern = () => {
//     const ctxStitch = document
//     .querySelector('.js-canvas-stitch')
//     .getContext('2d');

//   const stitchWidth = 5;

//   ctxStitch.canvas.width = stitchWidth;
//   ctxStitch.canvas.height = stitchWidth;

//   ctxStitch.strokeStyle = `rgba(220, 220, 220, 0.1)`;

//   ctxStitch.beginPath();
//   ctxStitch.moveTo(0, 0);
//   ctxStitch.lineTo(stitchWidth, stitchWidth);
//   ctxStitch.stroke();
//   ctxStitch.closePath();

//   ctxStitch.beginPath();
//   ctxStitch.moveTo(0, stitchWidth);
//   ctxStitch.lineTo(stitchWidth, 0);
//   ctxStitch.stroke();
//   ctxStitch.closePath();

//   const stitchPattern = ctx.createPattern(ctxStitch.canvas, 'repeat');
// }

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.globalCompositeOperation = 'multiply';

const width = canvas.width;
const height = canvas.height;
const half = .5;
const centerX = width * half;
const centerY = height * half;

// When drawing a polygon on canvas, we need to start and end and the initial
// point that the canvas should start drawing at. This ensures that each pair
// of coords can be manipulated. For example, leaving out the first point in
// the list below means the left edge of the shape wont get manipulated.

  /*
   * Surface class -> implements fill methods. Is HoC/superclass of canvas/paper
   * canvas/paper class -> implements draw methods?
   */

const drawPolygon = (context, verticies, colorIndex) => {
  const [ firstVertex ] = verticies;
  const fill = COLORS[colorIndex];

  let i = 1;

  context.fillStyle = fill;

  context.save();
  context.beginPath();
  context.translate(centerX, centerY);
  
  context.moveTo(firstVertex.x, firstVertex.y);

  while (i < verticies.length) {
    const vertex = verticies[i];
    context.lineTo(vertex.x, vertex.y);
    i++;
  }

  context.fill();
  context.closePath();
  context.restore();
};

const deform = (verticies, maxDepth = 0, variance, varianceDecrease) => {
  // We don't want to try and compare the last coordinate with
  // anything, it would be an out of range error
  const rangeEnd = verticies.length - 1;
  let deformedVerticies = [verticies[0]];

  for (let i = 1; i < rangeEnd; i++) {
    const start = verticies[i];
    const end = verticies[i + 1];

    const midpoint = {
      x: (start.x + end.x) * half,
      y: (start.y + end.y) * half,
    };
    
    // from midpoint, pick a new destination (B') using normal distribution
    const x = midpoint.x + gaussian() * variance;
    const y = midpoint.y + gaussian() * variance;
  
    const nextVerticies = [start, { x, y }];

    // insert a new end point for the origin: pairs = ([0], B')
    deformedVerticies = deformedVerticies.concat(nextVerticies);
  }

  if (maxDepth) {
    return deform(deformedVerticies, maxDepth - 1, variance / varianceDecrease, varianceDecrease);
  }

  return deformedVerticies;
}

// Break line up into two lines
const decomposeLine = (startPoint, endPoint, variance) => {
  const midpoint = {
    x: (startPoint.x + endPoint.x) * half,
    y: (startPoint.y + endPoint.y) * half,
  };
  
  // from midpoint, pick a new destination (B') using normal distribution
  const x = midpoint.x + gaussian() * variance;
  const y = midpoint.y + gaussian() * variance;

  return [startPoint, { x, y }];
};

const drawLayer = (context, polygon, colorIndex) => {
  let count = 0;

  while (count < POLYGON.DROPLET_COUNT) {
    requestAnimationFrame(() => {
      const deformed = deform(
        polygon,
        POLYGON.DEPTH,
        POLYGON.VARIANCE * random(-1, 4) * gaussian(),
        POLYGON.VARIANCE_DECREASE
      );
      drawPolygon(context, deformed, colorIndex);
    });

    count += 1;
  }
};

let total = 0;

const spreadVariance = distance => Math.min(random(-1, centerX) * gaussian(1), distance);

const makeDeformedPolygons = (count, positionOffset, numEdges) =>
  new Array(count).fill().map((_, i) => {
    const polygonOptions = {
      centerX: Math.cos(positionOffset * i) * spreadVariance(centerX * half),
      centerY: Math.sin(positionOffset * i) * spreadVariance(centerY * half),
      edgeLength: random(-1, 100) * gaussian(),
      edges: numEdges,
    };

    const polygon = Shapes.regularPolygon(polygonOptions);

    return deform(
      polygon,
      POLYGON.DEPTH,
      POLYGON.VARIANCE,
      POLYGON.VARIANCE_DECREASE
    );
  });

let polygonsToDraw = makeDeformedPolygons(
  POLYGON.DROPLET_COUNT,
  DROPLET_OFFSET,
  POLYGON.EDGES
);

const clear = () => {
  context.clearRect();
  total = 0;
};

const draw = () => {
  polygonsToDraw.forEach((polygon, index) => {
    drawLayer(
      context,
      polygon,
      index
    );

    total += POLYGON.POLYGON_STEP;

    if (total < POLYGON.POLYGON_COUNT) {
      window.requestAnimationFrame(draw);
    }
  });
};

draw();
