import {APP_SHOW_DRAWER} from '../constants/ActionTypes';

export function showDrawer(open) {
  return {
    type: APP_SHOW_DRAWER,
    open
  }
}
