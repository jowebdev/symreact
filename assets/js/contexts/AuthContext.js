/*
 * Copyright 2019 [Joachim CUPANI].
 * Website: https://www.cupani.fr
 * Email: hello@cupani.fr
 * License: MIT
 *
 *
 */
import React from 'react';

export default React.createContext({
    isAuthenticated : false,
    setIsAuthenticated: (value) =>{}
});