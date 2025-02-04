import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials=true;

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    const token = parts.length === 2 ? parts.pop().split(';').shift() : null;
    return token;
}

// Axios request interceptor to include token in requests
api.interceptors.request.use(
    (config) => {
        const token = getCookie('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // console.log("Request headers:", config.headers);
        return config;
    },
    (error) => Promise.reject(error)
);

// api.interceptors.request.use(
//     (config) => {
//         const token = getCookie('token');
//         if (!token) {
//             // Redirect to home page if token is missing
//             window.location.href = '/';
//             throw new Error('No authentication token found');
//         }
//         config.headers['Authorization'] = `Bearer ${token}`;
//         return config;
//     },
//     (error) => Promise.reject(error)
// );


// Axios response interceptor for handling unauthorized requests (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = '/';
            console.log(error);
        }
        return Promise.reject(error);
    }
);

export default api;
