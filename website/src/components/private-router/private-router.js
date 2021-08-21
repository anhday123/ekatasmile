import React from "react";
import { notification } from "antd";
import {
    Route,
    Redirect,
    useHistory,
} from "react-router-dom";
const PrivateRouter = ({ component: Component, ...rest }) => {
    let param = useHistory();
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
                        if ((param.location.pathname.indexOf('branch')) || param.location.pathname.indexOf('store')) {
                            return <Component {...props} />;
                        }
                        else {
                            openNotification()
                            return <Redirect to={`/overview/1`} />;
                        }
                    }
                } else {
                    return <Redirect to={`/`} />;
                }
            }}
        />
    );
};
export default PrivateRouter;