const initialState = '';
let timeoutID = null;

// Action creators
export const setNotification = (content, durationInSeconds = 5) => {
  const duration = durationInSeconds * 1000;

  return async (dispatch) => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        content,
      },
    });

    if (timeoutID !== null) {
      clearTimeout(timeoutID);
    }

    timeoutID = setTimeout(
      () =>
        dispatch({
          type: 'CLEAR_NOTIFICATION',
        }),
      duration
    );
  };
};

// Reducer
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data.content;
    case 'CLEAR_NOTIFICATION':
      return initialState;
    default:
      return state;
  }
};

export default reducer;
