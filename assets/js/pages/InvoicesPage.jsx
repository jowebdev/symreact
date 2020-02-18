/*
 * Copyright 2019 [Joachim CUPANI].
 * Website: https://www.cupani.fr
 * Email: hello@cupani.fr
 * License: MIT
 *
 *
 */

import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";
import moment from "moment";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger",
}
const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée",
}


const InvoicesPage = (props) => {

    // Liste des props & constantes
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    /**
     * Permet d'aller récupérer nos invoices
     * @returns {Promise<void>}
     */
    const fetchInvoices = async () => {
        // traitement asynchrone de suppression en bdd via AXIOS (=InvoicesAPI)
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
            setLoading(false);
        } catch (error) {
            console.log(error.response);
            toast.error("Erreur lors du chargement des factures");
        }
    };

    // Au chargement (si 2 eme param alors c 'est un catcher d event)
    useEffect(() => {
        fetchInvoices()
    }, []);

    /**
     * Suppression d'une facture
     * @param id
     * @returns {Promise<void>}
     */
    const handleDelete = async id => {

        // Copie de notre tableau original avant la suppression
        const originalInvoices = [...invoices];

        // Mise à jour visible pour l utilisateur
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        // traitement asynchrone de suppression en bdd via AXIOS (=CustomersAPI)
        try {
            await InvoicesAPI.delete(id);
            toast.success("La facture a bien été supprimé");

        } catch (error) {
            setInvoices(originalInvoices);
            console.log(error.response);
            toast.error("Une erreur est survenue");

        }
    };

    /**
     * Changement de page
     * @param page
     */
    const handlePageChange = (page) => setCurrentPage(page);

    /**
     * Fonction de filtre de nos customers
     * @param event
     */
    const handleSearch = (event) => {
        setCurrentPage(1);
        setSearch(event.currentTarget.value);
    };

    /**
     * Variable filtrés non paginé
     */
    const filteredInvoices = invoices.filter(
        i =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    /**
     * Variable filtrés ET paginé
     */
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    );

    /**
     * Gestion des formats de date
     * @param str
     * @returns {moment.Moment}
     */
    const formatDate = (str) => moment(str).format("DD/MM/YYYY");


    return (
        <>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Liste des factures</h1>
                <Link to="/invoice/new" className="btn btn-primary">Créer une facture</Link>
            </div>

            <div className="form-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder='Rechercher...'
                    onChange={handleSearch}
                    value={search}
                />
            </div>

            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th className="text-center">Date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Montant</th>
                    <th/>
                </tr>
                </thead>
                {!loading && <tbody>
                {paginatedInvoices.map(invoice => (
                    <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td>
                            <Link to={"/customer/" + invoice.customer.id}>
                                {invoice.customer.firstName} {invoice.customer.lastName}
                            </Link>
                        </td>
                        <td>{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span
                                className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <Link to={"/invoice/" + invoice.id} className="btn btn-sm btn-primary mr-1">
                                Editer
                            </Link>
                            <button
                                onClick={() => handleDelete(invoice.id)}
                                className="btn btn-sm btn-danger"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}

                </tbody>}
            </table>

            {loading && <TableLoader/>}


            {itemsPerPage < filteredInvoices.length && (
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredInvoices.length}
                    onPageChanged={handlePageChange}
                />
            )}


        </>
    );
}
export default InvoicesPage;