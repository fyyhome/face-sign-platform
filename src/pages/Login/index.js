import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { mockLogin, resetLogin } from 'src/services/permission';
import './style.less';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [form] = Form.useForm();

    const onToggle = e => {
        setIsRegister(!isRegister);
        e.preventDefault();
    };
    const onReset = () => {
        form.resetFields();
        resetLogin();
    };
    const onLogin = () => {
        // TODO
        mockLogin();
    };

    return (
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
                            name="phoneNumber"
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
                        <Button type="primary" htmlType="submit" onClick={onLogin}>
                            登录
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
