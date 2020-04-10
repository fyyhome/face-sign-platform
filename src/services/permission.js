import request from 'src/utils/request';

export const isLogin = () => {
    return request.get('/api/verify').then(res => {
        return res.data.code === 200;
    });
};

export const resetLogin = () => {
    localStorage.removeItem('token');
    console.log('remove token');
};

export const mockLogin = () => {
    localStorage.setItem('token', 'login');
    console.log('add token');
};
