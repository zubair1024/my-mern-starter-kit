import { REMOVE_ALERT, SET_ALERT } from "../actions/constants";

const initialState = [];
const alertReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      console.log(state);
      return state.filter((item) => item.id !== payload);
    default:
      return state;
  }
};

export default alertReducer;
