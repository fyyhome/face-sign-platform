import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Redirect } from 'react-router-dom';
import request from 'src/utils/request';
import './style.less';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [form] = Form.useForm();

    const onToggle = e => {
        setIsRegister(!isRegister);
        e.preventDefault();
    };
    const onReset = () => {
        form.resetFields();
    };
    const onFinsh = values => {
        const apiUrl = isRegister ? '/api/register' : '/api/login';
        request.post(apiUrl, {
            ...values
        }).then(res => {
            if (res.data.code === 200) {
                if (!isRegister) {
                    localStorage.setItem('token', res.data.data);
                    setIsLogin(true);
                } else {
                    setIsRegister(false);
                }
            }
        });
    };

    return isLogin ? (<Redirect to="/" />) : (
        <div className="login-page">
            <div className="form-wrap">
                <Form
                    labelCol={{
                        span: 8
                    }}
                    wrapperCol={{
                        span: 8
                    }}
                    form={form}
                    onFinish={onFinsh}
                >
                    <Form.Item
                        label="账号"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名'
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码'
                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    {
                        isRegister
                        ? (<Form.Item
                            label="手机号"
                            name="phone"
                        >
                            <Input type="number" />
                        </Form.Item>)
                        : null
                    
                    }
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            {isRegister ? '注册' : '登录'}
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            重置
                        </Button>
                        <Button type="link" htmlType="button" onClick={onToggle}>
                            {isRegister ? '登录' : '注册'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
