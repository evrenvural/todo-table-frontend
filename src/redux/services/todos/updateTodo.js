import axios from 'axios';
import { convertToDoubleFromDate } from '../../../resources/functions';

export default function updateTodo(todoId, data) {

    const expectedData = {
        ...data,
        date: convertToDoubleFromDate(data.date)
    }

    return axios.put(`http://localhost:8080/todo/${todoId}/update`, expectedData);
}