import ACTION_TYPE from '../../actions/todos';
import { REQUEST, SUCCESS, FAILURE } from '../../actions/action-type.util';

const InitialState = {
    todos: [],
    error: null,
    isLoading: false
};

export default function todos(state = InitialState, action = {}){
    switch(action.type) {
        case REQUEST(ACTION_TYPE.FETCH_TODOS):
            return {
                ...state,
                error: null,
                isLoading: true
            };
        case SUCCESS(ACTION_TYPE.FETCH_TODOS):
            return {
                ...state,
                todos: action.payload.data,
                error: null,
                isLoading: false
            };
        case FAILURE(ACTION_TYPE.FETCH_TODOS):
            return {
                ...state,
                error: action.payload.data,
                isLoading: false
            };
        case REQUEST(ACTION_TYPE.ADD_TODO):
            return {
                ...state,
                error: null,
                isLoading: true
            };
        case SUCCESS(ACTION_TYPE.ADD_TODO):
            const todosArray = [...state.todos];
            const newData = action.payload.data;
            todosArray.push(newData)

            return {
                ...state,
                todos: todosArray,
                error: null,
                isLoading: false
            };
        case FAILURE(ACTION_TYPE.ADD_TODO):
            return {
                ...state,
                error: action.payload.data,
                isLoading: false
            };
        default:
            return state;
    }
}
    
