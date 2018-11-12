import { combineReducers } from 'redux';
import colors from './colors';
import layers from './layers';
import polygon from './polygon';

const appState = combineReducers({
  colors,
  layers,
  polygon,
});

export default appState;
