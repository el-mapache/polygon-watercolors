import types from '../actions/types';

const polygonSettings = {
  /** 
   * Amount of 'wobble' added to new midpoint generation.
   * A variance of 0 does not change the fundamental shape
   * of the polygon, and will produce a straight line.
   * 
   * Scalar value multiplied by the amount of gaussian noise we generate at
   * each coordinate point
   **/
  variance: 60,
  /** 
   * The variance gets smaller with each deformation pass.
   * A value of zero means the variance is static throughout the drawing.
   * Any other value 'softens' the edges of the additonal polygon lines drawn.
   * 
   * A small variance decrease, regardless of the size of the variance produces
   * the most 'drop'-like polygon appearance.
  */
  varianceDecrease: 2,
  // number of initial polygons to generate
  droplets: 1,
  // number of sides to each polygon
  edges: 4,
  // The number of times each polygon should deformed
  depth: 3,
  // More or less controls radius of the polygon
  centerOffset: 150,
};

const initialState = {
  ...polygonSettings,
  // angle at which a droplet will be offset from another droplet
  dropletOffset: 2//parseInt(Math.PI * 2 / polygonSettings.droplets, 10),
};

export default (state = initialState, action) => {
  const { type, ...rest } = action;
  
  switch(type) {
    case types.UPDATE_POLYGON_SETTINGS: {
      return { ...state, ...rest };
    }

    default:
      return state;
  }
};
