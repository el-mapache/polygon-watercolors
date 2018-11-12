import types from '../actions/types';

const polygonSettings = {
  // amount of 'wobble' added to new midpoint generation
  variance: 20,
  // variance gets smaller with each deformation pass
  varianceDecrease: 2,
  // number of initial polygons to generate
  droplets: 3,
  // number of sides to each polygon
  edges: 8,
  // refers to the number of times a polygon should be deformed
  depth: 3,
  // modifier for offsettings the polygon relative to other polygons
  centerOffset: 150,
};

const initialState = {
  ...polygonSettings,
  // angle at which a droplet will be offset from another droplet
  dropletOffset: (Math.PI * 2) / polygonSettings.droplets,
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
