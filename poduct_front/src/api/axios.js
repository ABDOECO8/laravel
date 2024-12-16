import axios from 'axios';

const AxiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Correction ici : utilisez .env au lieu de .VITE_
});

export default AxiosClient;