// Les imports importants
import React from 'react';
import ReactDom from 'react-dom';
import NavBar from "./components/Navbar";
import HomePage from "./pages/HomePage";

import {HashRouter, Switch, Route} from "react-router-dom";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";

require('../css/app.css');

// Need jQuery? Install it with "yarn add jquery", then uncomment to require it.
// const $ = require('jquery');

console.log('Hello Webpack Encore! ...');

const App = () => {
    return (
        <HashRouter>
            <NavBar/>
            <main className='container pt-5'>
                <Switch>
                    <Route path="/invoices" component={InvoicesPage}/>
                    <Route path="/customers" component={CustomersPage}/>
                    <Route path="/" component={HomePage}/>
                </Switch>
            </main>
        </HashRouter>);
}

const rootElement = document.querySelector("#app");
ReactDom.render(<App/>, rootElement);