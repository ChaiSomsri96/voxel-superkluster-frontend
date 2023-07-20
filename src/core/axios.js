import axios from 'axios';
import { API_URL } from "./api";

export const Axios = axios.create({
    baseURL: API_URL
});

export const Canceler = axios.CancelToken.source();