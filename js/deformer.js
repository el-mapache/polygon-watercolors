// Break line up into two lines
const decomposeLine = (startVector, endVector) => {
  const midpoint = midpointOfVectors(startVector, endVector);
  // from midpoint, pick a new destination (B') using normal distribution
  const newMidpoint = MVNFromPoint(midpoint);

  return [startVector, newMidpoint, endVector];
};

const midpointOfVectors = (startVector, endVector) => {
  return [ (startVector[0] + endVector[0]) / 2, (startVector[1] + endVector[1]) / 2 ];
};

const MVNFromPoint = point, => multivariateNormal(point, DEFAULT_COVARIANTS).sample()

const deformer = (coords, covariants, iterations, maxDepth) => {
  return deformFn;
}

export default deformer;

