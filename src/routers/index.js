import {
    HomeOutlined,
    UserOutlined,
    KeyOutlined
} from '@ant-design/icons';
import Login from 'src/pages/Login';
import Index from 'src/pages/Index';
import DataEntry from 'src/pages/DataEntry';

const routers = [
    {
        path: '/login',
        title: '登录',
        icon: null,
        key: 'login',
        isShow: false,
        auth: false,
        component: Login
    },
    {
        path: '/',
        key: 'home',
        isShow: false,
        auth: true,
        component: null,
        routers: [
            {
                path: '/',
                title: '签到管理',
                icon: HomeOutlined,
                key: 'index',
                isShow: true,
                auth: true,
                component: Index
            },
            {
                path: '/data-entry',
                title: '照片录入',
                icon: UserOutlined,
                key: 'data-entry',
                isShow: true,
                auth: true,
                component: DataEntry,
            },
            {
                path: '/user',
                title: '用户',
                icon: UserOutlined,
                key: 'user',
                isShow: true,
                auth: true,
                component: null,
                routers: [
                    {
                        path: '/admin',
                        title: '管理员',
                        icon: KeyOutlined,
                        isShow: true,
                        auth: true,
                        key: 'admin',
                        component: null
                    }
                ]
            }
        ]
    },
];

export default routers;
