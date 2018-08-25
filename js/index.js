import Shapes from './shapes';
import PointFactory from './point';
import random from './utils/random';
import gaussian from './utils/gaussian';

const ALPHA = .01;
const COLORS = [
  `rgba(255, 0, 0, ${ALPHA})`,
  `rgba(0, 255, 0, ${ALPHA})`,
  `rgba(0, 0, 255, ${ALPHA})`,
];

const POLYGON = {
  VARIANCE: 20,
  VARIANCE_DECREASE: 6,
  DROPLET_COUNT: 3,
  EDGES: 10,
};

const LAYERS = {
  DEPTH: 3,
  POLYGON_COUNT: 200,
  POLYGON_STEP: 10,
}

const DROPLET_OFFSET = (Math.PI * 2) / POLYGON.DROPLET_COUNT;

const appState = {
  ALPHA,
  ...COLORS,
  ...POLYGON,
  ...LAYERS,
  DROPLET_OFFSET,
};

// cool pattern from a codepen example doing the same code!
const makeStitchPattern = (context) => {
  const ctxStitch = document
    .createElement('canvas')
    .getContext('2d');

  const stitchWidth = 10;

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
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.globalCompositeOperation = 'overlay';

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
  const fill = COLORS[colorIndex];
  let vertex = verticies.pop();

  context.fillStyle = fill;

  context.save();
  context.beginPath();
  context.translate(centerX, centerY);
  
  context.moveTo(vertex.x, vertex.y);

  while (vertex = verticies.pop()) {
    context.lineTo(vertex.x, vertex.y);
  }

  context.fill();
  context.closePath();
  context.restore();
};

const deform = (verticies, maxDepth = 0, variance, varianceDecrease) => {
  // We don't want to try and compare the last coordinate with
  // anything, it would be an out of range error
  const rangeEnd = verticies.length - 1;
  let deformedVerticies = [];

  for (let i = 0; i < rangeEnd; i++) {
    const start = verticies[i];
    const end = verticies[i + 1];

    const midpoint = {
      x: (start.x + end.x) * half,
      y: (start.y + end.y) * half,
    };
    
    // from midpoint, pick a new destination (B') using normal distribution
    /**
     * altering the x and y here by passing values into the gaussian
     * function will adjust the direction and stretch of the image painted on to
     * the canvas. Leaving the mean at 0 (no arguments) will preserve the
     * polygonal shape.
    */
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
/**
 * This function finds the midpoint of a line, and creates a new line
 * from the starting point of the line to a new midpoint, determined
 * by a gaussian distribution and a set amount of variance.
 * 
 * Note: this function is unused as inlining is a bit faster than repeated
 * function calls
 * 
 * @param {Point} startPoint reprsents the start of a line
 * @param {Point} endPoint represents the end of a line
 * @param {Number} variance the amount of randomness our new line
 * 
 * @returns Array an array of points
 */
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
        LAYERS.DEPTH,
        // low values here provide a bit more spread to the polygons
        // Higher values in the mean (1st arg) will paint over
        // the entire canvas, which may or may not be desireable
        POLYGON.VARIANCE * random(1, 2) * gaussian(),
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
      centerX: Math.cos(positionOffset * i) * spreadVariance(150),
      centerY: Math.sin(positionOffset * i) * spreadVariance(150),
      edgeLength: random(-1, 200) * gaussian(),
      edges: numEdges,
    };

    const polygon = Shapes.regularPolygon(polygonOptions);

    return deform(
      polygon,
      LAYERS.DEPTH,
      POLYGON.VARIANCE,
      POLYGON.VARIANCE_DECREASE
    );
  });

const clear = () => {
  context.clearRect(0, 0, width, height);
  total = 0;
};

const draw = () => {
  const polygonsToDraw = makeDeformedPolygons(
    POLYGON.DROPLET_COUNT,
    DROPLET_OFFSET,
    POLYGON.EDGES
  );

  // context.fillStyle = makeStitchPattern(context);
  // context.fill();

  polygonsToDraw.forEach((polygon, index) => {
    drawLayer(
      context,
      polygon,
      index
    );

    total += LAYERS.POLYGON_STEP;

    if (total < LAYERS.POLYGON_COUNT) {
      window.requestAnimationFrame(draw);
    }
  });
};

draw();

document.getElementById('redraw').addEventListener('click', () => {
  clear();
  draw();
});
