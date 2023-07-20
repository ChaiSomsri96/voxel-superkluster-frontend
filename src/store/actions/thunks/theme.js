import { Axios, Canceler } from '../../../core/axios';
import * as actions from '..';
import api from '../../../core/api';

export const setDarkMode = (darkMode) => async (dispatch) => {
  dispatch(actions.setDarkMode(darkMode));
};