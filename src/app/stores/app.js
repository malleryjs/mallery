import { alo } from 'vendor/alo.js';

const initState = {
  navActive: false,
  config: {}
};
const appStore = alo.createStore(initState, 'app');
export default appStore;

export const toggleNavActive = function() {
  return {
    type: 'toggleNavActive'
  };
};

export const setNavActive = function(active) {
  return {
    type: 'setNavActive',
    payload: (active != null)? active: true
  };
};

export const setConfig = function(config) {
  return {
    type: 'setConfig',
    payload: config
  };
};

appStore.createReducer((state, action) => {
  switch(action.type) {
    case 'setConfig':
      state.config = action.payload;
      break;
    case 'toggleNavActive':
      state.navActive = !state.navActive;
      break;
    case 'setNavActive':
      state.navActive = action.payload;
      break;
  }

  return state;
});
