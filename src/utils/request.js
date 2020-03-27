import axios from 'axios';

const config = {
    baseUrl: '',
    timeout: 10000
};

const tokenWrapper = (data, headers) => {
    if (localStorage.getItem('token')) {
        headers.Authorization = localStorage.getItem('token');
    } else {
        console.warn('没有找到token');
    }

    return data;
};

export const request = axios.create({
    ...config,
    transformRequest: [tokenWrapper]
});

export default request;
