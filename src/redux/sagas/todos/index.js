import { take, call, put } from 'redux-saga/effects';
import ACTION_TYPE from '../../actions/todos';
import { REQUEST, SUCCESS, FAILURE } from '../../actions/action-type.util';

import { todoServices } from '../../services';

export function* getTodosSaga(){
    while(true) {
        try{
            // take action
            yield take(REQUEST(ACTION_TYPE.FETCH_TODOS));

            // service call
            const response = yield call([todoServices, todoServices.getTodos]);

            // change state
            yield put({
                type: SUCCESS(ACTION_TYPE.FETCH_TODOS),
                payload: {data: response.data}
            });
        } catch(error){
            yield put({
                type: FAILURE(ACTION_TYPE.FETCH_TODOS),
                payload: {data: error}
            });
        }
    }
}

export function* addTodoSaga(){
    while(true) {
        try{
            // take action
            const { payload } = yield take(REQUEST(ACTION_TYPE.ADD_TODO));

            // service call
            const response = yield call([todoServices, todoServices.addTodo], payload.data);

            // change state
            yield put({
                type: SUCCESS(ACTION_TYPE.ADD_TODO),
                payload: {data: response.data}
            });
        } catch(error){
            yield put({
                type: FAILURE(ACTION_TYPE.ADD_TODO),
                payload: {data: error}
            });
        }
    }
}

export function* updateTodoSaga(){
    while(true) {
        try{
            // take action
            const { payload } = yield take(REQUEST(ACTION_TYPE.UPDATE_TODO));

            // service call
            const response = yield call([todoServices, todoServices.updateTodo], payload.todoId, payload.data);

            // change state
            yield put({
                type: SUCCESS(ACTION_TYPE.UPDATE_TODO),
                payload: {data: response.data}
            });
        } catch(error){
            yield put({
                type: FAILURE(ACTION_TYPE.UPDATE_TODO),
                payload: {data: error}
            });
        }
    }
}

export function* deleteTodoSaga(){
    while(true) {
        try{
            // take action
            const { payload } = yield take(REQUEST(ACTION_TYPE.DELETE_TODO));

            // service call
            yield call([todoServices, todoServices.deleteTodo], payload.todoId);

            // change state
            yield put({
                type: SUCCESS(ACTION_TYPE.DELETE_TODO),
                payload: {id: payload.todoId}
            });
        } catch(error){
            yield put({
                type: FAILURE(ACTION_TYPE.DELETE_TODO),
                payload: {data: error}
            });
        }
    }
}

export function* changeStatusNextSaga(){
    while(true) {
        try{
            // take action
            const { payload } = yield take(REQUEST(ACTION_TYPE.CHANGE_STATUS_NEXT));

            // service call
            const response = yield call([todoServices, todoServices.changeStatusNext], payload.todoId);

            // change state
            yield put({
                type: SUCCESS(ACTION_TYPE.CHANGE_STATUS_NEXT),
                payload: {data: response.data}
            });
        } catch(error){
            yield put({
                type: FAILURE(ACTION_TYPE.CHANGE_STATUS_NEXT),
                payload: {data: error}
            });
        }
    }
}

export function* changeStatusPrevSaga(){
    while(true) {
        try{
            // take action
            const { payload } = yield take(REQUEST(ACTION_TYPE.CHANGE_STATUS_PREV));

            // service call
            const response = yield call([todoServices, todoServices.changeStatusPrev], payload.todoId);

            // change state
            yield put({
                type: SUCCESS(ACTION_TYPE.CHANGE_STATUS_PREV),
                payload: {data: response.data}
            });
        } catch(error){
            yield put({
                type: FAILURE(ACTION_TYPE.CHANGE_STATUS_PREV),
                payload: {data: error}
            });
        }
    }
}