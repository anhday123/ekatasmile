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
const CheckRouter = ({ component: Component, ...rest }) => {
    let param = useHistory();
    console.log("|||")
    console.log(param)
    var temp = 0;
    return (
        <Route
            {...rest}
            component={(props) => {
                const data = localStorage.getItem("accessToken");
                if (data) {
                    if (temp === 0) {
                        temp = 1;
                        return <Redirect to={`/overview/1`} />;
                    }

                } else {
                    return <Component {...props} />;
                }
            }}
        />
    );
};
export default CheckRouter;