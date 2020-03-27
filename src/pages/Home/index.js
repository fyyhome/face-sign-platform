import React from 'react';
import BasicLayout from 'src/layout/BasicLayout';
import { Switch, Redirect } from 'react-router-dom';
import AuthRoute from 'src/utils/authRoute';
import { isLogin } from 'src/services/permission';


export default function HomePage({router: homeRouter}) {
    const { routers } = homeRouter;
    return (
        <BasicLayout routers={routers}>
            <Switch>
                <AuthRoute routers={routers} beforeEnter={() => {
                    return isLogin() ? true : () => {
                        return (
                            <Redirect to="/login" />
                        );
                    };
                }} />
            </Switch>
        </BasicLayout>
    );
}
