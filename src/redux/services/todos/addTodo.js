import axios from 'axios';

export default function addTodo(data) {
    return axios.post("http://localhost:8080/todo/add", data);
}