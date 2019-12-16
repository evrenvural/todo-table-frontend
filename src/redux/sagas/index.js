import { fork, all } from 'redux-saga/effects';

// sagas
import { getTodosSaga, addTodoSaga } from './todos';

export default function* root(){
    yield all([
        fork(getTodosSaga),
        fork(addTodoSaga)
    ])
}