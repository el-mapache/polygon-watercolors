import Shapes from './shapes';
import random from './utils/random';
import gaussian from './utils/gaussian';

export default function(appState) {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  context.globalCompositeOperation = 'multiply';

  const width = canvas.width;
  const height = canvas.height;
  const half = .5;
  const centerX = width * half;
  const centerY = height * half;

  let total = 0;

  // When drawing a polygon on canvas, we need to start and end and the initial
  // point that the canvas should start drawing at. This ensures that each pair
  // of coords can be manipulated. For example, leaving out the first point in
  // the list below means the left edge of the shape wont get manipulated.

    /*
    * Surface class -> implements fill methods. Is HoC/superclass of canvas/paper
    * canvas/paper class -> implements draw methods?
    */

  const drawPolygon = (context, verticies, colorIndex, alpha) => {
    const fill = appState.colors.colors[colorIndex];
    let i = 1;
    let vertex = verticies[0];

    context.fillStyle = fill(appState.colors.alpha - (alpha * 0.001));

    context.save();
    context.beginPath();
    context.translate(centerX, centerY);
    
    context.moveTo(vertex.x, vertex.y);

    while (vertex = verticies[i]) {
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
    const rangeEnd = verticies.length;
    const noise = gaussian();
    let makeNeg = random(0, 100);
    
    if (makeNeg < 40 && variance >= 0) {
      variance = ~variance;
    }

    if (variance < 0) {
      if (makeNeg < 10) {
        variance = ~variance + 1;
      }
    } else if (makeNeg > 10 && makeNeg < 54) {
      variance = variance << 1
    }
    console.log(variance)
    let deformedVerticies = [];

    for (let i = 0; i < rangeEnd; i++) {
      const start = verticies[i];
      const end = i === verticies.length - 1 ? verticies[0] : verticies[i + 1];

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
      const x = (midpoint.x + gaussian() * variance) | 0;
      const y = (midpoint.y + gaussian() * variance) | 0;
      const nextVerticies = [start, { x, y }];

      // insert a new end point for the origin: pairs = ([0], B')
      deformedVerticies = deformedVerticies.concat(nextVerticies);
    }

    if (maxDepth) {
      return deform(deformedVerticies, maxDepth - 1, variance / varianceDecrease, varianceDecrease);
    }

    return deformedVerticies;
  }

  const drawLayer = (context, polygon, colorIndex) => {
    for (let count = 0; count < appState.layers.depth; count++) {
      requestAnimationFrame(() => {
        const deformed = deform(
          polygon,
          appState.polygon.depth,
          // low values here provide a bit more spread to the polygons
          // Higher values in the mean (1st arg) will paint over
          // the entire canvas, which may or may not be desireable
          appState.polygon.variance,
          appState.polygon.varianceDecrease
        );

        //const alphaAttenuation = (appState.layers.polygonCount - total) >> count;
        drawPolygon(context, deformed, colorIndex, count);
      });
    }
  };

  const SPREAD_VARIANCE = Math.min(Math.min(width, height) * half, appState.polygon.centerOffset);

  const makeDeformedPolygons = (count, positionOffset, numEdges) =>
    new Array(count).fill().map((_, i) => {
      const polygonOptions = {
        centerX: Math.cos(positionOffset * i) * SPREAD_VARIANCE + gaussian(),
        centerY: Math.sin(positionOffset * i) * SPREAD_VARIANCE + gaussian(),
        edgeLength: SPREAD_VARIANCE + random(-15, 15),
        edges: numEdges,
      };

      const polygon = Shapes.regularPolygon(polygonOptions);

      return deform(
        polygon,
        appState.polygon.depth,
        appState.polygon.variance,
        appState.polygon.varianceDecrease
      );
    });

  const clear = () => {
    context.clearRect(0, 0, width, height);
    total = 0;
  };

  clear();

  const draw = () => {
    // try this outside the draw loop maybe? so it makes fewer changes?
    const polygonsToDraw = makeDeformedPolygons(
      appState.polygon.droplets,
      appState.polygon.dropletOffset,
      appState.polygon.edges
    );
    polygonsToDraw.forEach((polygon, index) => {
      drawLayer(
        context,
        polygon,
        index
      );
    });

    total += appState.layers.polygonStep;

    if (total < appState.layers.polygonCount) {
      window.requestAnimationFrame(draw);
    }
  };

  clear();
  draw();
};
