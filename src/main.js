import React from 'react';
import ReactDom from 'react-dom';
import routers from 'src/routers';
import { isLogin } from 'src/services/permission';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import AuthRoute from 'src/components/AuthRoute';
import BasicLayout from 'src/layout/BasicLayout';

const homeRouter = routers.find(router => router.path === '/');
const loginRouter = routers.find(router => router.path === '/login');

function App() {
    return (
        <Router>
            <Switch>
                <Route path={loginRouter.path}>
                    <loginRouter.component />
                </Route>
                <BasicLayout routers={homeRouter.routers}>
                    <Switch>
                        <AuthRoute routers={homeRouter.routers} beforeEnter={() => {
                            // 优化点：请求未返回前，会跳转到主页，渲染null。应该在请求没有验证通过前无法跳转到主页
                            return new Promise((resolve) => {
                                isLogin().then(res => {
                                    res ? resolve(true) : resolve(() => {
                                        return (
                                            <Redirect to="/login" />
                                        );
                                    });
                                }).catch(() => resolve(() => {
                                    return (
                                        <Redirect to="/login" />
                                    );
                                }));
                            });
                        }} />
                    </Switch>
                </BasicLayout>
            </Switch>
        </Router>
    );
}

ReactDom.render(<App />, document.querySelector('#app'));
