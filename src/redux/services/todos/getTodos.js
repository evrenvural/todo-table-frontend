import axios from 'axios';

export default function getTodos() {
    console.log("You're in bro");
    
    return axios.get("https://api.github.com/users/evrenvural");
}