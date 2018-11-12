const alpha = .006;
const initialState = {
  alpha,
  colors: [
    (a = alpha) => `hsla(355.55, 92%, 70%, ${a})`,
    (a = alpha) => `hsla(40, 100%, 50%, ${a})`,
    (a = alpha) => `rgba(50, 50, 200, ${a})`,
  ], 
};

export default (state = initialState, action) => {
  const { type, settings } = action;
  
  switch(action.type) {

    default:
      return state;
  }
};
