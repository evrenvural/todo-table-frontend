import axios from 'axios';

export default function changeStatusPrev(todoId) {
    return axios.put(`http://localhost:8080/todo/${todoId}/changeStatusPrev`, todoId);
}