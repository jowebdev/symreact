/*
 * Copyright 2019 [Joachim CUPANI].
 * Website: https://www.cupani.fr
 * Email: hello@cupani.fr
 * License: MIT
 *
 *
 */

import axios from "axios";
import {INVOICES_API} from '../config';

/**
 * Récupération de la liste des factures
 * @returns {Promise<AxiosResponse<any>>}
 */
function findAll() {
    return axios
        .get(INVOICES_API)
        .then(response => response.data['hydra:member']);
}

/**
 * Suppression d'une facture
 * @param id
 * @returns {AxiosPromise}
 */
function deleteInvoice(id) {
    return axios
        .delete(INVOICES_API + '/' + id);
}

/**
 * Récupère une facture
 * @param id
 * @returns {AxiosPromise}
 */

function find(id) {
    return axios
        .get(INVOICES_API + '/' + id)
        .then(response => response.data);
}

/**
 * Mise à jour d'une facture
 * @param id
 * @param invoice
 * @returns {AxiosPromise<any>}
 */
function update(id, invoice) {
    return axios.put(INVOICES_API + '/' + id, {
        ...invoice,
        customer: '/api/customers/' + invoice.customer
    })
}

/**
 * Création d'une facture
 * @param invoice
 * @returns {AxiosPromise<any>}
 */
function create(invoice) {
    return axios.post(INVOICES_API, {
        ...invoice,
        customer: '/api/customers/' + invoice.customer
    })
}

export default {
    findAll,
    find,
    update,
    create,
    delete: deleteInvoice
};