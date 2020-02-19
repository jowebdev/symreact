/*
 * Copyright 2019 [Joachim CUPANI].
 * Website: https://www.cupani.fr
 * Email: hello@cupani.fr
 * License: MIT
 *
 *
 */

import axios from "axios";
import jwtDecode from "jwt-decode";
import {LOGIN_API} from "../config";

/**
 * Requete HTTP d'authentification et stockage du token dans le local storage et dans Axios
 * @param {Object} credentials
 * @returns {Promise<boolean>}
 */
function authenticate(credentials) {

    return axios
        .post(LOGIN_API, credentials)
        .then(response => response.data.token)
        .then(token => {
            // je stocke le token dans mon local storage
            window.localStorage.setItem("authToken", token);

            // on prévient Axios qu'on as maintenant un header oar défaut sur toutes nos futures requêtes.
            setAxiosToken(token);

            return true;

        });

}

/**
 * Déconnexion (suppression du token sur axios et dans le local storage
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Mise en  place lors du chargement de l'application
 */
function setup() {

    const token = window.localStorage.getItem("authToken");

    // si le token est valide ?
    if (token) {
        const {exp: expiration} = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

/**
 * Positionne le token JWT sur Axios
 * @param {string} token
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;

}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns {boolean}
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");

    // si le token est valide ?
    if (token) {
        const {exp: expiration} = jwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
    }

    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};