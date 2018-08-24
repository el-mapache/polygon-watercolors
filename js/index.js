import multivariateNormal from "multivariate-normal";
import Shapes from './shapes';
import PointFactory from './point';
import random from './utils/random';
import gaussian from './utils/gaussian';

const DEFAULTS = {
  FILL: '#af4144',
  DEPTH: 5,
  VARIANCE: 20,
  VARIANCE_DECREASE: 2,
  POLYGON_COUNT: 200,
  DROPLETS: 5,
  DROPLET_OFFSET: (Math.PI * 2) / this.DROPLETS,
  EDGES: 10,
};

const DEFAULT_FILL = '#af4144';
const DEFAULT_DEPTH = 5;
const DEFAULT_VARIANCE = 20;
const DEFAULT_VARIANCE_DECREASE = 2;



const DEFAULT_COVARIANTS = [
  [10, 0],
  [0, 10]
];

let covariance = DEFAULT_COVARIANTS;

const SHAPE_START_X = 100;
const SHAPE_START_Y = 300;



const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

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

const drawPolygon = (context, start, coords, fill = DEFAULT_FILL) => {
  context.beginPath();
  context.moveTo(start.x, start.y);
  coords.forEach(coordPair => context.lineTo(coordPair.x, coordPair.y));
  context.closePath();
};

const fill = (context, fill = DEFAULT_FILL) => {
  context.fillStyle = fill;
  context.fill();
}

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
    const nextVerticies = decomposeLine(start, end);

    // insert two new pairs: pairs = ([0], B') and (B' to [1])
    deformedVerticies = deformedVerticies.concat(nextVerticies);
  }

  verticies.length = 0;

  if (maxDepth) {
    return deform(deformedVerticies, maxDepth - 1);
  }

  return deformedVerticies;
}

//Im not using the word vector right here
//these are points, i need to get the magnitude and direction 
// to have a vector
//
// Break line up into two lines
const decomposeLine = (startPoint, endPoint) => {
  const midpoint = applyVector(midpointOfLine(startPoint, endPoint));
  // from midpoint, pick a new destination (B') using normal distribution
  //const covariant = (() => {
  //  const x = randomFromRange((midpoint[0] | 0) - 10, (midpoint[0] | 0) + 10) | 0;
  //  const y = randomFromRange((midpoint[1] | 0) - 10, (midpoint[1] | 0) + 10) | 0;

  //  return [ 
  //    [ 1, midpoint[0] ],
  //    [ midpoint[1], 1 ] 
  //  ];
  //})();
  const newMidpoint = MVNFromPoint(midpoint, covariance);
  //const [mpX, mpY] = newMidpoint;
  //const finalMid = [mpX - (mpX * 0.1), mpY ^ (mpY * 0.1) ]
  return [startPoint, newMidpoint, endPoint];
};

const applyVector = point => {
  return point;
  // const magnitude = random(0.1, 0.7);
  // console.log(magnitude);
  // return [point[0] * magnitude, point[1] * magnitude];
};

const midpointOfLine = (startPoint, endPoint) => {
  console.log(startPoint, endPoint)
  return [ (startPoint.x + endPoint.x) / 2, (startPoint.y + endPoint.y) / 2 ];
};

const MVNFromPoint = (point, covariant) => multivariateNormal(point, covariant).sample();//makeCovariant(covariant)).sample();

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
  const polygons = new Array(DEFAULTS.DROPLETS).fill().map((_, i) => {
    const polygonOptions = {
      centerX: Math.cos(DEFAULTS.DROPLET_OFFSET * i) * gaussian(1),
      centerY: Math.cos(DEFAULTS.DROPLET_OFFSET * i) * gaussian(1),
      sideLength: 100,
      edges: DEFAULTS.EDGES,
    };
  
    const polygon = Shapes.regularPolygon(polygonOptions);
    
    return polygon;
  });

  polygons.forEach((polygon) => {
    drawPolygon(context, [ polygonOptions.centerX, polygonOptions.centerY ], polygon);
    fill(context);
    fillTransparent(context);
  });
  const polygonOptions = {
		centerX,
		centerY,
		sideLength: 100,
		edges: DEFAULTS.EDGES,
	};

  const polygon = Shapes.regularPolygon(polygonOptions);
  //const deformed = deform(deform(deform(polygon, 2, 1000), 2), 2);
  //const deformed1 = deform(polygon);

  context.clearRect(0, 0, width, height);
  //drawLayers(30, context, deformed);
  //drawPolygon(context, [200, 200], deformed);
  drawPolygon(context, [ polygonOptions.centerX, polygonOptions.centerY ], polygon);
  fill(context);
  fillTransparent(context);
};

draw();

//document.getElementById('redraw').addEventListener('click', draw);
//setInterval(() => { draw(); }, 350);
