import React from 'react';
import { Route } from 'react-router-dom';


/**
 * 广度查找
 * @param {[]} routers 
 * @param {function} callback 
 */
const deepFind = (routers, callback) => {
    if (!Array.isArray(routers) || routers.length === 0) {
        return;
    }
    const restRouters = [];
    
    for (let router of routers) {
        if (callback(router)) {
            return router;
        } else {
            restRouters.push(...[...(router.routers || [])]);
        }
    }

    return deepFind(restRouters, callback);
};


/**
 * 
 * @param {object} props
 * 
 * {
 *      beforeEnter: function(): bollean | render() {}
 *      router:
 * }
 * Switch组件自动为内部组件注入location
 */

export default function({routers, beforeEnter, location}) {
    const { pathname } = location;
    console.log(pathname, 'pathname');
    const targetRouter = deepFind(routers, router => router.path === pathname);
    if (!targetRouter) {
        return null;
    }
    const { auth, component, path } = targetRouter;

    const authStatus = beforeEnter && typeof beforeEnter === 'function' && beforeEnter();

    const renderRoute = () => component ? (
        <Route path={path}>
            {React.createElement(component, {
                router: targetRouter
            })}
        </Route>
    ) : null;

    const renderAuth = authStatus => typeof authStatus === 'function'
        ? authStatus() : authStatus === true ? renderRoute() : null;
    
    return auth ? renderAuth(authStatus) : renderRoute();
}
