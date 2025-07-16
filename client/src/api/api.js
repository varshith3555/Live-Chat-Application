import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API = axios.create({ baseURL: API_URL + '/api' });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) req.headers.Authorization = `Bearer ${user.token}`;
  return req;
});

export default API; 