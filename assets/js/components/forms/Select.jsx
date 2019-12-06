/*
 * Copyright 2019 [Joachim CUPANI].
 * Website: https://www.cupani.fr
 * Email: hello@cupani.fr
 * License: MIT
 *
 *
 */

import React from 'react';


const Select = ({name, label, value, onChange, error = "", children}) =>
    (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <select
                name={name}
                id={name}
                className={"form-control" + (error && " is-invalid")}
                onChange={onChange}
                value={value}
            >
                {children}
            </select>
            {error && <p className="invalid-feedback">{error}</p>}
        </div>
    );
export default Select;