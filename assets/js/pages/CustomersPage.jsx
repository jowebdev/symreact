/*
 * Copyright 2019 [Joachim CUPANI].
 * Website: https://www.cupani.fr
 * Email: hello@cupani.fr
 * License: MIT
 *
 */

import React, {useEffect, useState} from 'react';
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/customersAPI";

const CustomersPage = (props) => {

    // Liste des props & constantes
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const itemsPerPage = 10;

    /**
     * Permet d'aller récupérer nos customers
     * @returns {Promise<void>}
     */
    const fetchCustomers = async () => {
        // traitement asynchrone de suppression en bdd via AXIOS (=CustomersAPI)
        try{
            const data =  await CustomersAPI.findAll();
            setCustomers(data);
        }catch(error){
            console.log(error.response);
        }
    }

    // Au chargement (si 2 eme param alors c 'est un catcher d event)
    useEffect(() => {
        fetchCustomers()
    }, []);

    /**
     * Suppression d'un customer
     * @param id
     * @returns {Promise<void>}
     */
    const handleDelete = async id => {

        // Copie de notre tableau original avant la suppression
        const originalCustomers  = [...customers];

        // Mise à jour visible pour l utilisateur
        setCustomers(customers.filter(customer => customer.id !== id));

        // traitement asynchrone de suppression en bdd via AXIOS (=CustomersAPI)
        try{
            await CustomersAPI.delete(id);
        }catch(error){
            setCustomers(originalCustomers);
            console.log(error.response);
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
    const handleSearch = (event) =>{
        setCurrentPage(1);
        setSearch(event.currentTarget.value);
    };

    /**
     * Variable filtrés non paginé
     */
    const filteredCustomers  = customers.filter(
        c =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    /**
     * Variable filtrés ET paginé
     */
    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        currentPage,
        itemsPerPage
    );


    return (
        <>
            <h1>Liste des clients</h1>

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
                    <th>Id.</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th/>
                </tr>
                </thead>
                <tbody>
                {paginatedCustomers.map(customer => (
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td><a href="#">{customer.firstName} {customer.lastName}</a></td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center">
                            <span className="badge badge-primary">{customer.invoices.lenght}</span>
                        </td>
                        <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                        <td>
                            <button
                                onClick={() => handleDelete(customer.id)}
                                disabled={customer.invoices.length > 0}
                                className="btn btn-sm btn-danger"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}

                </tbody>
            </table>

            {itemsPerPage < filteredCustomers.length &&(
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredCustomers.length}
                onPageChanged={handlePageChange}
            />
            )}


        </>
    );
}
export default CustomersPage;