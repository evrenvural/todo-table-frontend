import { fork, all } from 'redux-saga/effects';

// sagas
import { getTodosSaga, addTodoSaga, updateTodoSaga, deleteTodoSaga } from './todos';

export default function* root(){
    yield all([
        fork(getTodosSaga),
        fork(addTodoSaga),
        fork(updateTodoSaga),
        fork(deleteTodoSaga)
    ])
}