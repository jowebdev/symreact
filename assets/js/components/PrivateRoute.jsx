/*
 * Copyright 2019 [Joachim CUPANI].
 * Website: https://www.cupani.fr
 * Email: hello@cupani.fr
 * License: MIT
 *
 *
 */

import React, {useContext} from "react";
import AuthContext from "../contexts/AuthContext";
import {Route, Redirect} from "react-router-dom";

const PrivateRoute = ({path, component}) => {
    const {isAuthenticated} = useContext(AuthContext);
    return isAuthenticated ? <Route path={path} component={component}/> : <Redirect to="/login"/>;
};
export default PrivateRoute;