import { take, call, put } from 'redux-saga/effects';
import ACTION_TYPE from '../../actions/todos';
import { REQUEST, SUCCESS, FAILURE } from '../../actions/action-type.util';

import { todoServices } from '../../services';

export function* getTodosSaga(){
    while(true) {
        try{
            // take action
            const { payload } = yield take(REQUEST(ACTION_TYPE.FETCH_TODOS));

            // service call
            const response = yield call([todoServices, todoServices.getTodos]);

            // change state
            yield put({
                type: SUCCESS(ACTION_TYPE.FETCH_TODOS),
                payload: {data: response}
            });
        } catch(error){
            yield put({
                type: FAILURE(ACTION_TYPE.FETCH_TODOS),
                payload: {data: error}
            });
        }
    }
}