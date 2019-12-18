import axios from 'axios';

export default function updateTodo(todoId, data) {
    return axios.put(`http://localhost:8080/todo/${todoId}/update`, data);
}