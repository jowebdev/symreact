/*
 * Copyright 2019 [Joachim CUPANI].
 * Website: https://www.cupani.fr
 * Email: hello@cupani.fr
 * License: MIT
 *
 *
 */

import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const CustomerPage = ({match, history}) => {

    // Récupération des paramètres de l url
    const {id = "new"} = match.params;

    // Etat Edition ou non ?
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Etat Customer
    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        company: "",
        email: ""
    });

    // Etat Erreur sur les champs Customer
    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        company: "",
        email: ""
    });

    // Récupération du customer en fonction de l'identifiant
    const fetchCustomer = async id => {
            try {
                const {firstName, lastName, email, company} = await CustomersAPI.find(id);
                setLoading(false);
                setCustomer({firstName, lastName, email, company});
            } catch (error) {
                toast.error("Impossible de charger le client");
                history.replace("/customers");
            }
        }
    ;

    // Chargement du customer si besoin au chargement du comopsant ou au changement d'id
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            setLoading(true);
            fetchCustomer(id);
        }
    }, [id]);


    // Fonction appelée lors d'une modification d'un champ
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setCustomer({...customer, [name]: value});
    };

    // Fonction appelée lors d'une la soumission
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            if (editing) {
                await CustomersAPI.update(id, customer);
                toast.success("Le client a bien été modifiée");

            } else {
                await CustomersAPI.create(customer);
                toast.success("Le client a bien été créée");
                history.replace("/customers");
            }
            setErrors({});


        } catch ({response}) {

            // En cas d'erreur l'api nous renvoies les "violations" (les erreurs), on les affecte à notre "etat erreurs" pour qu'il les affiche directement
            const {violations} = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                        apiErrors[propertyPath] = message;
                    }
                )
                ;
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire");
            }
        }
    };

    return (
        <>
            <h1>{!editing && "Création" || "Modification"} d'un client</h1>
            {loading && <FormContentLoader/>}

            {!loading &&
            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Nom de famille du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Email du client"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retourner à la liste</Link>
                </div>

            </form>}

        </>
    );
}
export default CustomerPage;