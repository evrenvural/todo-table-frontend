import axios from 'axios';

export default function deleteTodo(todoId) {
    return axios.delete(`http://localhost:8080/todo/${todoId}/delete`, todoId);
}