/*
 * Copyright 2019 [Joachim CUPANI].
 * Website: https://www.cupani.fr
 * Email: hello@cupani.fr
 * License: MIT
 *
 *
 */

import React, {useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import UsersAPI from "../services/UsersAPI";

const RegisterPage = ({history}) => {

    // State User
    const [user, setUser] = useState({
        "firstName": "",
        "lastName": "",
        "email": "",
        "password": "",
        "passwordConfirm": "",
    });

    // State Error User
    const [errors, setErrors] = useState({
        "firstName": "",
        "lastName": "",
        "email": "",
        "password": "",
        "passwordConfirm": "",
    });

    // Fonction appelée lors d'une modification d'un champ
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setUser({...user, [name]: value});
    };

    // Fonction appelée lors d'une la soumission
    const handleSubmit = async event => {
        event.preventDefault();

        try {

            await UsersAPI.register(user);
            // TODO:  Flash notification de succès
            setErrors({});
            history.replace("/login");


        } catch ({response}) {
            // En cas d'erreur l'api nous renvoies les "violations" (les erreurs), on les affecte à notre "etat erreurs" pour qu'il les affiche directement
            const {violations} = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                        apiErrors[propertyPath] = message;
                    }
                );
                setErrors(apiErrors);
                // TODO:  Flash notification d'erreur
            }
        }
    };

    return (
        <>
            <h1>Inscription</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    value={user.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre nom de famille"
                    value={user.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Adresse email"
                    value={user.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="password"
                    type="password"
                    label="Mot de passe"
                    placeholder="Votre mot de passe"
                    value={user.password}
                    onChange={handleChange}
                    error={errors.password}
                />
                <Field
                    name="passwordConfirm"
                    type="password"
                    label="Confirmation de mot de passe"
                    placeholder="Confirmer votre mot de passe"
                    value={user.passwordConfirm}
                    onChange={handleChange}
                    error={errors.passwordConfirm}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Confirmation</button>
                    <Link to="/login" className="btn btn-link">Retour à la page de connexion</Link>
                </div>

            </form>
        </>
    );
}
export default RegisterPage;