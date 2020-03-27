import {
    HomeOutlined,
    UserOutlined,
    KeyOutlined
} from '@ant-design/icons';
import Login from 'src/pages/Login';
import Home from 'src/pages/Home';

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
        component: Home,
        routers: [
            {
                path: '/index',
                title: '首页',
                icon: HomeOutlined,
                key: 'index',
                isShow: true,
                auth: true,
                component: null
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
