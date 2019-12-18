import axios from 'axios';

export default function changeStatusNext(todoId) {
    return axios.put(`http://localhost:8080/todo/${todoId}/changeStatusNext`, todoId);
}