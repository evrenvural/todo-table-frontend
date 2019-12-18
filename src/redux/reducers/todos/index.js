import ACTION_TYPE from '../../actions/todos';
import { REQUEST, SUCCESS, FAILURE } from '../../actions/action-type.util';

const InitialState = {
    todos: [],
    error: null,
    isLoading: false
};

let tempTodoArray = [];

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
            tempTodoArray = [...state.todos];
            const newData = action.payload.data;
            tempTodoArray.push(newData)

            return {
                ...state,
                todos: tempTodoArray,
                error: null,
                isLoading: false
            };
        case FAILURE(ACTION_TYPE.ADD_TODO):
            return {
                ...state,
                error: action.payload.data,
                isLoading: false
            };
        case REQUEST(ACTION_TYPE.UPDATE_TODO):
            return {
                ...state,
                error: null,
                isLoading: true
            };
        case SUCCESS(ACTION_TYPE.UPDATE_TODO):
            tempTodoArray = [...state.todos];
            tempTodoArray = tempTodoArray.map( 
                item => item.id === action.payload.id ? 
                    action.payload.data : item
                );

            return {
                ...state,
                todos: tempTodoArray,
                error: null,
                isLoading: false
            };
        case FAILURE(ACTION_TYPE.UPDATE_TODO):
            return {
                ...state,
                error: action.payload.data,
                isLoading: false
            };
        case REQUEST(ACTION_TYPE.DELETE_TODO):
            return {
                ...state,
                error: null,
                isLoading: true
            };
        case SUCCESS(ACTION_TYPE.DELETE_TODO):
            tempTodoArray = [...state.todos];
            tempTodoArray = tempTodoArray.filter(item => item.id !== action.payload.id);

            return {
                ...state,
                todos: tempTodoArray,
                error: null,
                isLoading: false
            };
        case FAILURE(ACTION_TYPE.DELETE_TODO):
            return {
                ...state,
                error: action.payload.data,
                isLoading: false
            };
        default:
            return state;
    }
}
    
