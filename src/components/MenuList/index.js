import React from 'react';
import {
    Link
} from 'react-router-dom';
import { Menu } from 'antd';
import './style.less';

/**
 * 
 * @param {router[]} routers
 * 
 * {
 *      path:'',
 *      component: '',
 *      key: '',
 *      isShow: true,
 *      title: '',
 *      icon: '',
 *      routers: []
 * }
 * 
 */
const { SubMenu } = Menu;

const renderRouters = routers => {
    if (!Array.isArray(routers)) {
        return;
    }
    return routers.map(router => {
        const { key, path, title, icon, isShow, routers} = router;
        if (!isShow) {
            if (routers) {
                return renderRouters(routers);
            }
            return;
        }

        if (routers) {
            return (
                <SubMenu
                    key={key}
                    title={
                        <span>
                            {React.createElement(icon)}
                            <span>{title}</span>
                        </span>
                    }
                >
                    {renderRouters(routers)}
                </SubMenu>
            );
        }
        return (
            <Menu.Item key={key}>
                {React.createElement(icon)}
                <span><Link className='link' to={path}>{title}</Link></span>
            </Menu.Item>
        );
    });
};

export default function MenuList({routers, defaultSelectedKeys, theme = 'dark', mode = 'inline'}) {
    return (
        <Menu
            mode={mode}
            theme={theme}
            defaultSelectedKeys={defaultSelectedKeys}
        >
            {renderRouters(routers)}
        </Menu>
    );
}
