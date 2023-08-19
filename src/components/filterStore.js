const SET_FILTER = 'SET_FILTER';

const initialState = 'top'; // Set your initial filter value here

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER:
      return action.payload;
    default:
      return state;
  }
};

export default filterReducer;