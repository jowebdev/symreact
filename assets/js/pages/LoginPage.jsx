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
                <div className="form-group"><label htmlFor="username">Adresse email</label>
                    <input type="email"
                           value={credentials.username}
                           onChange={handleChange}
                           className={"form-control" + (error && " is-invalid")}
                           placeholder="Adresse email de connexion"
                           name="username"/>

                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input type="password"
                           onChange={handleChange}
                           value={credentials.password}
                           className="form-control"
                           placeholder="Mot de passe"
                           name="password"/>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </>
    );
}
export default LoginPage;