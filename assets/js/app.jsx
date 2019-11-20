// Les imports importants
import React, {useState} from 'react';
import ReactDom from 'react-dom';
import {HashRouter, Switch, Route, withRouter} from "react-router-dom";

// Components
import NavBar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";

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
                <NavbarWithRouter />
                <main className='container pt-5'>
                    <Switch>
                        <Route
                            path="/login"
                            component={LoginPage}
                        />
                        <PrivateRoute
                            path="/invoices"
                            component={InvoicesPage}
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