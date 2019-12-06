/*
 * Copyright 2019 [Joachim CUPANI].
 * Website: https://www.cupani.fr
 * Email: hello@cupani.fr
 * License: MIT
 *
 *
 */

import React, {useContext, useState} from 'react';
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";

const LoginPage = ({history}) => {

    // Récupère les données fournit en context
    const {setIsAuthenticated} = useContext(AuthContext);

    // Init de nos variables
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });
    const [error, setError] = useState('');

    /**
     * Gestion des champs
     * @param currentTarget (EVENT)
     */
    const handleChange =  ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCredentials({...credentials, [name] : value});
    };

    /**
     * Gestion du submit
     * @param event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/customers");

        }catch (error) {
            setError("Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas");
        }
    };

    return (
        <>
            <h1>Connexion à l'application</h1>
            <form onSubmit={handleSubmit}>
                <Field
                    label="Adresse email"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Adresse email de connexion"
                    name="username"
                    error={error}
                    type="email"
                />
                <Field
                    type="password"
                    onChange={handleChange}
                    value={credentials.password}
                    label="Mot de passe"
                    name="password"
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </>
    );
}
export default LoginPage;