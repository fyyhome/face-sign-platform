import React from 'react';
import ReactDom from 'react-dom';
import routers from 'src/routers';
import { isLogin } from 'src/services/permission';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import AuthRoute from 'src/utils/authRoute';

function App() {
    return (
        <Router>
            <Switch>
                {
                    routers.map((router, index) => router.component ? router.auth ? (
                        <AuthRoute key={index} routers={routers} beforeEnter={() => {
                            return isLogin() ? true : () => {
                                return (
                                    <Redirect to="/login" />
                                );
                            };
                        }} />
                    ) : (
                        <Route path={router.path} key={index}>
                            {React.createElement(router.component, {
                                router: router
                            })}
                        </Route>
                    ) : null)
                }
            </Switch>
        </Router>
    );
}

ReactDom.render(<App />, document.querySelector('#app'));
