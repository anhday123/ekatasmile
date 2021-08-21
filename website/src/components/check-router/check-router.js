import React from "react";
import {
    Route,
    Redirect,
    useHistory,
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