// STASHED HERE FOR NOW
// code is inlined to improve draw speed

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

import gaussian from './gaussian';

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