export const isLogin = () => localStorage.getItem('token') ? true : false;

export const resetLogin = () => {
    localStorage.removeItem('token');
    console.log('remove token');
};

export const mockLogin = () => {
    localStorage.setItem('token', 'login');
    console.log('add token');
};
