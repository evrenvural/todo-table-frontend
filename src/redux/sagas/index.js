import { fork, all } from 'redux-saga/effects';

// sagas
import { getTodosSaga } from './todos';

export default function* root(){
    yield all([
        fork(getTodosSaga)
    ])
}