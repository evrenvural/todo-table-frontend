import axios from 'axios';

export default function getTodos() {
    return axios.get("http://localhost:8080/todo/all");
}