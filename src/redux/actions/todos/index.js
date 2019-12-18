import { REQUEST } from '../action-type.util';

const ACTION_TYPE = {
    FETCH_TODOS: 'todo/FETCH_TODOS',
    ADD_TODO: 'todo/ADD_TODO',
    DELETE_TODO: 'todo/DELETE_TODO'
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

export const deleteTodo = (dispatch, todoId) => {
    dispatch({
        type: REQUEST(ACTION_TYPE.DELETE_TODO),
        payload: { todoId }
    });
}

export default ACTION_TYPE;