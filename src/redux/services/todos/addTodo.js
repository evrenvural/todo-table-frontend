import axios from 'axios';
import { convertToDoubleFromDate } from '../../../resources/functions';

export default function addTodo(data) {
    
    const expectedData = {
        ...data,
        date: convertToDoubleFromDate(data.date)
    }
    
    return axios.post("http://localhost:8080/todo/add", expectedData);
}