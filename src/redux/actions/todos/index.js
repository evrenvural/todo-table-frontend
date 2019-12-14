import { REQUEST } from '../action-type.util';

const ACTION_TYPE = {
    FETCH_TODOS: 'todos/FETCH_TODOS'
}

export const fetchTodos = (dispatch) => {
    dispatch({
        type: REQUEST(ACTION_TYPE.FETCH_TODOS)
    });
}

export default ACTION_TYPE;