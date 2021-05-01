import * as actionTypes from '../actions/actionTypes';
import * as utilities from '../../Utils/utility';

const initialState = {
  classes: [],
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_CLASS_START:
      return utilities.updateObject(state, { loading: true, error: null });
    case actionTypes.ADD_CLASS_FAIL:
      return utilities.updateObject(state, { loading: false, error: action.error });
    case actionTypes.ADD_CLASS_SUCCESS: {
      const newClass = {
        ...action.classData,
        id: action.classId,
      };
      return utilities.updateObject(
        state,
        {
          loading: false,
          error: null,
          classes: state.classes.concat(newClass),
        },
      );
    }
    case actionTypes.EDIT_CLASS_START:
      return utilities.updateObject(state, { loading: true, error: null });
    case actionTypes.EDIT_CLASS_SUCCESS: {
      const updatedClasses = utilities.updateObjectInArray(state.classes, action);
      return utilities.updateObject(
        state,
        {
          loading: false,
          error: null,
          classes: updatedClasses,
        },
      );
    }
    case actionTypes.EDIT_CLASS_FAIL:
      return utilities.updateObject(state, { loading: false, error: action.error });
    case actionTypes.FETCH_CLASSES_START:
      return utilities.updateObject(state, { loading: true, error: null });
    case actionTypes.FETCH_CLASSES_SUCCESS:
      return utilities.updateObject(
        state,
        {
          loading: false,
          error: null,
          classes: [...action.classes],
        },
      );
    case actionTypes.FETCH_CLASSES_FAIL:
      return utilities.updateObject(state, { loading: false, error: action.error });
    case actionTypes.ATTENDED_CLASSES_START:
      return utilities.updateObject(state, { loading: true, error: null });
    case actionTypes.ATTENDED_CLASSES_SUCCESS:
      return utilities.updateObject(
        state,
        {
          loading: false,
          error: null,
          classes: [...action.classes],
        },
      );
    case actionTypes.ATTENDED_CLASSES_FAIL:
      return utilities.updateObject(state, { loading: false, error: action.error });
    case actionTypes.APPROVE_REJECT_START:
      return utilities.updateObject(state, { loading: true, error: null });
    case actionTypes.APPROVE_REJECT_SUCCESS: {
      const updatedState = { ...state };
      const index = updatedState.classes.findIndex((classData) => classData.id === action.id);
      updatedState.classes[index].students = [...action.students];
      return utilities.updateObject(updatedState, { loading: true, error: null });
    }
    case actionTypes.APPROVE_REJECT_FAIL:
      return utilities.updateObject(state, { loading: false, error: action.error });
    default: return state;
  }
};

export default reducer;
