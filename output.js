/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__point__ = __webpack_require__(34);


const Shapes = {
		regularPolygon({ centerX, centerY, edgeLength, edges }) {
				const { sin, PI, cos } = Math;
				/**
     * in radians, PI maps to 180 degrees. This angle is needed
     * to compute the radius of a polygon, following this formula:
     * 
     * sideLength / 2 * sin(180/numOfSides)
     */
				const angle = PI / edges;
				/**
     * as noted above, this is the standard formula for finding
     * the radius of a regular polygon
     */
				const radius = edgeLength / (2 * sin(angle));

				let verticies = [];

				for (let i = 0; i < edges; i++) {
						/**
       * moving in a circle from the center point of the ploygon,
       * generate verticies `${edgeLength}` degrees (technically, in radians)
       * apart from one another
      */
						const x = centerX + radius * cos(angle * (1 + 2 * i));
						const y = centerY + radius * sin(angle * (1 + 2 * i));
						verticies[i] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__point__["a" /* default */])(x, y);
				}

				/**
     * Manually add the first vertex to the end of the array
     * so the polygon closes itself. Without this, there will be
     * a pacman-style bite taken out of the shape!
    */
				verticies = verticies.concat([verticies[0]]);

				return verticies;
		}
};

/* harmony default export */ __webpack_exports__["a"] = (Shapes);

/***/ }),

/***/ 12:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shapes__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__point__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_random__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_gaussian__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__utils_gaussian__);





const ALPHA = .009;
const COLORS = [
// `hsla(0, 100%, 66%, ${ALPHA})`,
// `hsla(100, 100%, 70%, ${ALPHA})`,
// `hsla(204, 100%, 50%, ${ALPHA})`,

//`hsla(25, 100%, 29%, ${ALPHA})`,
`rgba(255, 0, 0, ${ALPHA})`, `rgba(0, 255, 0, ${ALPHA})`, `rgba(0, 0, 255, ${ALPHA})`];

const POLYGON = {
  DEPTH: 5,
  VARIANCE: 20,
  VARIANCE_DECREASE: 2,
  POLYGON_COUNT: 200,
  POLYGON_STEP: 2,
  DROPLET_COUNT: 3,
  EDGES: 7
};

const DROPLET_OFFSET = Math.PI * 2 / POLYGON.DROPLET_COUNT;

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
  const [firstVertex] = verticies;
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
      y: (start.y + end.y) * half
    };

    // from midpoint, pick a new destination (B') using normal distribution
    const x = midpoint.x + __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default()() * variance;
    const y = midpoint.y + __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default()() * variance;

    const nextVerticies = [start, { x, y }];

    // insert a new end point for the origin: pairs = ([0], B')
    deformedVerticies = deformedVerticies.concat(nextVerticies);
  }

  if (maxDepth) {
    return deform(deformedVerticies, maxDepth - 1, variance / varianceDecrease, varianceDecrease);
  }

  return deformedVerticies;
};

// Break line up into two lines
const decomposeLine = (startPoint, endPoint, variance) => {
  const midpoint = {
    x: (startPoint.x + endPoint.x) * half,
    y: (startPoint.y + endPoint.y) * half
  };

  // from midpoint, pick a new destination (B') using normal distribution
  const x = midpoint.x + __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default()() * variance;
  const y = midpoint.y + __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default()() * variance;

  return [startPoint, { x, y }];
};

const drawLayer = (context, polygon, colorIndex) => {
  let count = 0;

  while (count < POLYGON.DROPLET_COUNT) {
    requestAnimationFrame(() => {
      const deformed = deform(polygon, POLYGON.DEPTH, POLYGON.VARIANCE * __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_random__["a" /* default */])(-1, 4) * __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default()(), POLYGON.VARIANCE_DECREASE);
      drawPolygon(context, deformed, colorIndex);
    });

    count += 1;
  }
};

let total = 0;

const spreadVariance = distance => Math.min(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_random__["a" /* default */])(-1, centerX) * __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default()(1), distance);

const makeDeformedPolygons = (count, positionOffset, numEdges) => new Array(count).fill().map((_, i) => {
  const polygonOptions = {
    centerX: Math.cos(positionOffset * i) * spreadVariance(centerX * half),
    centerY: Math.sin(positionOffset * i) * spreadVariance(centerY * half),
    edgeLength: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_random__["a" /* default */])(-1, 100) * __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default()(),
    edges: numEdges
  };

  const polygon = __WEBPACK_IMPORTED_MODULE_0__shapes__["a" /* default */].regularPolygon(polygonOptions);

  return deform(polygon, POLYGON.DEPTH, POLYGON.VARIANCE, POLYGON.VARIANCE_DECREASE);
});

let polygonsToDraw = makeDeformedPolygons(POLYGON.DROPLET_COUNT, DROPLET_OFFSET, POLYGON.EDGES);

const clear = () => {
  context.clearRect();
  total = 0;
};

const draw = () => {
  polygonsToDraw.forEach((polygon, index) => {
    drawLayer(context, polygon, index);

    total += POLYGON.POLYGON_STEP;

    if (total < POLYGON.POLYGON_COUNT) {
      window.requestAnimationFrame(draw);
    }
  });
};

draw();

/***/ }),

/***/ 32:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ((min, max) => Math.random() * (max - min + 1) + min);

/***/ }),

/***/ 33:
/***/ (function(module, exports) {

const gaussian = (mean = 0, sd = 1) => {
  let y1;
  let x1;
  let x2;
  let w;
  let previous;

  if (previous) {
    y1 = y2;
    previous = false;
  } else {
    do {
      x1 = Math.random() * 2 - 1;
      x2 = Math.random() * 2 - 1;
      w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt(-2 * Math.log(w) / w);
    y1 = x1 * w;
    y2 = x2 * w;
    previous = true;
  }

  return y1 * sd + mean;
};

module.exports = gaussian;

/***/ }),

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Point */
class Point {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }
}

const PointFactory = (x, y) => new Point({ x, y });



/* harmony default export */ __webpack_exports__["a"] = (PointFactory);

/***/ })

/******/ });