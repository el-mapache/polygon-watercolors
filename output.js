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





const ALPHA = .06;
const COLORS = [`hsla(0, 100%, 66%, ${ALPHA})`, `hsla(100, 100%, 70%, ${ALPHA})`, `hsla(204, 100%, 50%, ${ALPHA})`];

const POLYGON = {
  DEPTH: 5,
  VARIANCE: 20,
  VARIANCE_DECREASE: 2,
  POLYGON_COUNT: 200,
  DROPLET_COUNT: 6,
  EDGES: 8
};

const DROPLET_OFFSET = Math.PI * 2 / POLYGON.DROPLET_COUNT;

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

console.log(Math.min(Math.min(centerX, centerY) * 0.5, 150) * __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_random__["a" /* default */])(-15, 15));

// When drawing a polygon on canvas, we need to start and end and the initial
// point that the canvas should start drawing at. This ensures that each pair
// of coords can be manipulated. For example, leaving out the first point in
// the list below means the left edge of the shape wont get manipulated.

/*
 * Surface class -> implements fill methods. Is HoC/superclass of canvas/paper
 * canvas/paper class -> implements draw methods?
 */

const randomCovariant = num => [[num, 0], [0, num]];

const makeCovariant = max => randomCovariant(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_random__["a" /* default */])(1, max));

const drawPolygon = (context, verticies) => {
  const [firstVertex] = verticies;
  const fill = COLORS[__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_random__["a" /* default */])(0, 2) | 0];

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
};

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
};

//Im not using the word vector right here
//these are points, i need to get the magnitude and direction 
// to have a vector
//
// Break line up into two lines
const decomposeLine = (startPoint, endPoint, variance) => {
  const midpoint = applyMagnitude(midpointOfLine(startPoint, endPoint));
  // from midpoint, pick a new destination (B') using normal distribution
  //const covariant = (() => {
  //  const x = randomFromRange((midpoint[0] | 0) - 10, (midpoint[0] | 0) + 10) | 0;
  //  const y = randomFromRange((midpoint[1] | 0) - 10, (midpoint[1] | 0) + 10) | 0;

  //  return [ 
  //    [ 1, midpoint[0] ],
  //    [ midpoint[1], 1 ] 
  //  ];
  //})();
  const x = midpoint.x + __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default()() * variance;
  const y = midpoint.y + __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default()() * variance;

  //const [mpX, mpY] = newMidpoint;
  //const finalMid = [mpX - (mpX * 0.1), mpY ^ (mpY * 0.1) ]
  return [startPoint, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__point__["a" /* default */])(x, y), endPoint];
};

const applyMagnitude = point => {
  const magnitude = 1; //random(0.1, 0.7);
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__point__["a" /* default */])(point.x * magnitude, point.y * magnitude);
};

const midpointOfLine = (startPoint, endPoint) => {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__point__["a" /* default */])((startPoint.x + endPoint.x) * half, (startPoint.y + endPoint.y) * half);
};

const drawLayers = (times, context, polygon) => {
  let count = times;

  while (count) {
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
      centerX: Math.cos(DROPLET_OFFSET * i) * Math.min(centerX, centerY) * 0.75 * __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default()(1),
      centerY: Math.sin(DROPLET_OFFSET * i) * Math.min(centerX, centerY) * 0.75 * __WEBPACK_IMPORTED_MODULE_3__utils_gaussian___default()(1),
      edgeLength: Math.min(Math.min(centerX, centerY) * .5, 20) * __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils_random__["a" /* default */])(-15, 15),
      edges: POLYGON.EDGES
    };

    return __WEBPACK_IMPORTED_MODULE_0__shapes__["a" /* default */].regularPolygon(polygonOptions);;
  });

  polygons.forEach(polygon => {
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