import React, { Component } from "react";
import { Row, Col, Form, Input, Button, notification, Checkbox } from "antd";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useParams
} from "react-router-dom";
const PrivateRouter = ({ component: Component, ...rest }) => {
    let param = useHistory();

    console.log("||||||||||||||||||||||||||||||888")
    console.log(param)
    var temp = 0;
    const openNotification = () => {
        notification.warning({
            message: 'Cảnh báo',
            description:
                'Bạn không đủ quyền sử dụng menu này.',
        });
    };
    return (
        <Route
            {...rest}
            component={(props) => {
                const data = localStorage.getItem("accessToken");
                const menu_list = JSON.parse(localStorage.getItem('menu_list'))
                const permission_list = JSON.parse(localStorage.getItem('permission_list'))
                if (data) {
                    if (menu_list && menu_list.length > 0) {
                        console.log("||||||||||||||||||||||||||||||999")
                        menu_list.map((values, index) => {
                            if (param.location.pathname.indexOf(values)) {
                                temp++;
                            } else {

                            }
                        })
                        if (temp === 0) {
                            openNotification()
                        } else {
                            return <Component {...props} />;
                        }
                    } else {
                        openNotification()
                        return <Redirect to={`/overview/1`} />;
                    }
                } else {
                    return <Redirect to={`/`} />;
                }
            }}
        />
    );
};
export default PrivateRouter;