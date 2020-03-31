import React, { useState } from 'react';
import { Layout } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import MenuList from 'src/components/MenuList';
import './style.less';

const { Header, Sider, Content } = Layout;

export default function BaseLayout({children, routers}) {
    const [collapsed, setCollasped] = useState(false);

    return (
        <Layout className="layout">
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className='side-header'>
                    <span className='side-header-title'>NCU签到系统</span>
                </div>
                <MenuList
                    routers={routers}
                    defaultSelectedKeys={routers[0].key}
                ></MenuList>
            </Sider>
            <Layout>
                <Header className='site-layout-background'>
                    {React.createElement(collapsed ? MenuFoldOutlined : MenuUnfoldOutlined, {
                        onClick: () => setCollasped(!collapsed)
                    })}
                </Header>
                <Content className='site-layout-background content'>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
