import types from './types';
import store from '../store';

const updatePolygonAction = nextSettings => ({
  type: types.UPDATE_POLYGON_SETTINGS,
  ...nextSettings,
});

const updateLayerAction = nextSettings => ({
  type: types.UPDATE_LAYER_SETTINGS,
  ...nextSettings,
});


export {
  updatePolygonAction,
  updateLayerAction,
};
