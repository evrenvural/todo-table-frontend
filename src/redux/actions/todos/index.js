import { REQUEST } from '../action-type.util';

const ACTION_TYPE = {
    FETCH_TODOS: 'todo/FETCH_TODOS',
    ADD_TODO: 'todo/ADD_TODO'
}

export const fetchTodos = (dispatch) => {
    dispatch({
        type: REQUEST(ACTION_TYPE.FETCH_TODOS)
    });
}

export const addTodo = (dispatch, data) => {
    dispatch({
        type: REQUEST(ACTION_TYPE.ADD_TODO),
        payload: { data }
    });
}

export default ACTION_TYPE;