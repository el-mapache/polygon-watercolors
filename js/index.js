import Shapes from './shapes';
import PointFactory from './point';
import random from './utils/random';
import gaussian from './utils/gaussian';

const ALPHA = .06;
const COLORS = [
  `hsla(0, 100%, 66%, ${ALPHA})`,
  `hsla(100, 100%, 70%, ${ALPHA})`,
  `hsla(204, 100%, 50%, ${ALPHA})`,
];

const POLYGON = {
  DEPTH: 5,
  VARIANCE: 20,
  VARIANCE_DECREASE: 2,
  POLYGON_COUNT: 200,
  DROPLET_COUNT: 6,
  EDGES: 8,
};

const DROPLET_OFFSET = (Math.PI * 2) / POLYGON.DROPLET_COUNT;

const DEFAULT_DEPTH = 5;
const DEFAULT_VARIANCE = 20;
const DEFAULT_VARIANCE_DECREASE = 2;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.globalCompositeOperation = 'multiply';

const width = canvas.width;
const height = canvas.height;
const half = .5;
const centerX = width * half;
const centerY = height * half;

console.log(Math.min(Math.min(centerX, centerY) * 0.5, 150) * random(-15, 15));

// When drawing a polygon on canvas, we need to start and end and the initial
// point that the canvas should start drawing at. This ensures that each pair
// of coords can be manipulated. For example, leaving out the first point in
// the list below means the left edge of the shape wont get manipulated.

  /*
   * Surface class -> implements fill methods. Is HoC/superclass of canvas/paper
   * canvas/paper class -> implements draw methods?
   */

const randomCovariant = num =>
  [
    [num, 0],
    [0, num]
  ];

const makeCovariant = max => randomCovariant(random(1, max));

const drawPolygon = (context, verticies) => {
  const [ firstVertex ] = verticies;
  const fill = COLORS[random(0,2) | 0];

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

const fillTransparent = () => {
  context.fillStyle = 'rgba(255, 55, 57, .04)';
  context.fill();
}

const deform = (verticies, maxDepth = 0, variance, varianceDecrease) => {
  // We don't want to try and compare the last coordinate with
  // anything, it would be an out of range error
  const rangeEnd = verticies.length - 1;
  let deformedVerticies = [];

  for (let i = 0; i < rangeEnd; i++) {
    const start = verticies[i];
    const end = verticies[i + 1];
    const nextVerticies = decomposeLine(start, end, variance);

    // insert two new pairs: pairs = ([0], B') and (B' to [1])
    deformedVerticies = deformedVerticies.concat(nextVerticies);
  }

  verticies.length = 0;

  if (maxDepth) {
    return deform(deformedVerticies, maxDepth - 1, variance / varianceDecrease, varianceDecrease);
  }

  return deformedVerticies;
}

//Im not using the word vector right here
//these are points, i need to get the magnitude and direction 
// to have a vector
//
// Break line up into two lines
const decomposeLine = (startPoint, endPoint, variance) => {
  const midpoint = applyMagnitude(
    midpointOfLine(
      startPoint,
      endPoint
    )
  );
  // from midpoint, pick a new destination (B') using normal distribution
  //const covariant = (() => {
  //  const x = randomFromRange((midpoint[0] | 0) - 10, (midpoint[0] | 0) + 10) | 0;
  //  const y = randomFromRange((midpoint[1] | 0) - 10, (midpoint[1] | 0) + 10) | 0;

  //  return [ 
  //    [ 1, midpoint[0] ],
  //    [ midpoint[1], 1 ] 
  //  ];
  //})();
  const x = midpoint.x + gaussian() * variance;
  const y = midpoint.y + gaussian() * variance;

  //const [mpX, mpY] = newMidpoint;
  //const finalMid = [mpX - (mpX * 0.1), mpY ^ (mpY * 0.1) ]
  return [startPoint, PointFactory(x, y), endPoint];
};

const applyMagnitude = (point) => { 
  const magnitude = 1;//random(0.1, 0.7);
  return PointFactory(point.x * magnitude, point.y * magnitude);
};

const midpointOfLine = (startPoint, endPoint) => {
  return PointFactory(
    (startPoint.x + endPoint.x) * half,
    (startPoint.y + endPoint.y) * half,
  );
};

const drawLayers = (times, context, polygon) => {
  let count = times;

  while(count) {
    let copy = deform(polygon.slice());
    drawPolygon(context, [200, 200], copy);
    fillTransparent(context);
    copy.length = 0;
    count -= 1;
  }
};

const draw = () => {
  const polygons = new Array(POLYGON.DROPLET_COUNT).fill().map((_, i) => {
    const polygonOptions = {
      centerX: Math.cos(DROPLET_OFFSET * i) * Math.min(centerX, centerY) * 0.75 * gaussian(1),
      centerY: Math.sin(DROPLET_OFFSET * i) * Math.min(centerX, centerY) * 0.75 * gaussian(1),
      edgeLength: Math.min(Math.min(centerX, centerY) * .5, 20) * random(-15, 15),
      edges: POLYGON.EDGES,
    };
    
    return Shapes.regularPolygon(polygonOptions);;
  });

  polygons.forEach((polygon) => {
    drawPolygon(context, deform(polygon, 4, POLYGON.VARIANCE, POLYGON.VARIANCE_DECREASE));
  });

  // const polygonOptions = {
	// 	centerX,
	// 	centerY,
	// 	sideLength: 100,
	// 	edges: DEFAULTS.EDGES,
	// };

  // const polygon = Shapes.regularPolygon(polygonOptions);
  // //const deformed = deform(deform(deform(polygon, 2, 1000), 2), 2);
  // //const deformed1 = deform(polygon);

  // context.clearRect(0, 0, width, height);
  // //drawLayers(30, context, deformed);
  // //drawPolygon(context, [200, 200], deformed);
  // drawPolygon(context, [ polygonOptions.centerX, polygonOptions.centerY ], polygon);
  // fill(context);
  // fillTransparent(context);
};

draw();

//document.getElementById('redraw').addEventListener('click', draw);
//setInterval(() => { draw(); }, 350);
