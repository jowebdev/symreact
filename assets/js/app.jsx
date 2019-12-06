// Les imports importants
import React, {useState} from 'react';
import ReactDom from 'react-dom';
import {HashRouter, Route, Switch, withRouter} from "react-router-dom";
// Components
import NavBar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
// Pages
import HomePage from "./pages/HomePage";
import CustomerPage from "./pages/CustomerPage";
import CustomersPage from "./pages/CustomersPage";
import InvoicePage from "./pages/InvoicePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// Services
import AuthAPI from "./services/AuthAPI";
// Context
import AuthContext from "./contexts/AuthContext";

// Import de la feuille de style
require('../css/app.css');

// Authentifcation depuuis le localStorage
AuthAPI.setup();


const App = () => {

    // On injecte les props dans notre composant NavBar
    const NavbarWithRouter = withRouter(NavBar);

    // data
    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            <HashRouter>
                <NavbarWithRouter/>
                <main className='container pt-5'>
                    <Switch>
                        <Route
                            path="/login"
                            component={LoginPage}
                        />
                        <Route
                            path="/register"
                            component={RegisterPage}
                        />
                        <PrivateRoute
                            path="/invoice/:id"
                            component={InvoicePage}
                        />
                        <PrivateRoute
                            path="/invoices"
                            component={InvoicesPage}
                        />
                        <PrivateRoute
                            path="/customer/:id"
                            component={CustomerPage}
                        />
                        <PrivateRoute
                            path="/customers"
                            component={CustomersPage}
                        />

                        <Route path="/" component={HomePage}/>
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>);
}

const rootElement = document.querySelector("#app");
ReactDom.render(<App/>, rootElement);