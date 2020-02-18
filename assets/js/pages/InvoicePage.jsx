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
import Select from "../components/forms/Select";
import {Link} from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from "../services/InvoicesAPI";
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";


const InvoicePage = ({match, history}) => {

    // Récupération des paramètres de l url
    const {id = "new"} = match.params;

    // Etat Edition ou non ?
    const [editing, setEditing] = useState(false);

    // Etat Customer
    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT",
    });

    const [loading, setLoading] = useState(false);


    // Etat Liste des clients
    const [customers, setCustomers] = useState([]);

    // Etat Erreur sur les champs Customer
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: "",
    });

    // Récupération d'une facture en fonction de l'identifiant
    const fetchInvoice = async id => {
            try {
                const {amount, customer, status} = await InvoicesAPI.find(id);
                setInvoice({amount, status, customer: customer.id});
                setLoading(false);

            } catch (error) {
                toast.error("Impossible de charger la facture demandé");

                history.replace("/invoices");
            }
        }
    ;

    // Récupération des clients facture en fonction de l'identifiant
    const fetchCustomers = async () => {
            try {
                const data = await CustomersAPI.findAll();
                setCustomers(data);
                setLoading(false);
                setInvoice({...invoice, customer: data[0].id});

            } catch (error) {
                toast.error("Impossible de charger les clients");

                history.replace("/invoices");

            }
        }
    ;

    // Chargement des clients au chargement du composant (avant le chargement des datas de la facture)
    useEffect(() => {
        fetchCustomers();
    }, []);


    // Chargement de l'invoice si besoin au chargement du composant ou au changement d'id
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        }
    }, [id]);


    // Fonction appelée lors d'une modification d'un champ
    const handleChange = ({currentTarget}) => {
        const {value, name} = currentTarget;
        setInvoice({...invoice, [name]: value});
    };

    // Fonction appelée lors d'une la soumission
    const handleSubmit = async event => {
        event.preventDefault();
        try {
            if (editing) {
                await InvoicesAPI.update(id, invoice);
                toast.success("La facture a bien été éditée");

            } else {
                await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été créée");
                history.replace("/invoices");
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
                );
                setErrors(apiErrors);
                toast.error("Des erreurs dans votre formulaire");

            }
        }
    };

    return (
        <>

            <h1>{!editing && "Création" || "Modification"} d'une facture</h1>

            {loading && <FormContentLoader/>}

            {!loading && <form onSubmit={handleSubmit}>
                <Field
                    name="amount"
                    type="number"
                    label="Montant"
                    placeholder="Montant de la facture"
                    value={invoice.amount}
                    onChange={handleChange}
                    error={errors.amount}
                />


                <Select
                    name="customer"
                    label="Client"
                    value={invoice.customer}
                    onChange={handleChange}
                    error={errors.customer}
                >
                    {customers.map(({id, firstName, lastName}) =>
                        <option value={id} key={id}>
                            {firstName} {lastName}
                        </option>
                    )}
                </Select>


                <Select
                    name="status"
                    label="Statut"
                    value={invoice.status}
                    onChange={handleChange}
                    error={errors.status}
                >
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link">Retourner à la liste</Link>
                </div>

            </form>}

        </>
    );
};
export default InvoicePage;