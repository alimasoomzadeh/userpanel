import React, {useState} from "react";
import {HashRouter, Switch, Route} from "react-router-dom";

import {AppContext} from './page/AppContext';
import Home from "./page/Home";
import UserPanel from "./page/userPage/UserPanel";


export default function App() {

    // ساخت state اولیه برای کامپوننت ها
    const [loggedInModel, setLoggedInModel] = useState({
        username: "",
        loginUser: false,
        logout: () => {
            let loginResult = false;
            let loggedInModel = {

            };
            if (!loginResult) {
                setLoggedInModel(
                    {
                        ...loggedInModel,
                        username: "",
                        loginUser: false,
                    });
            }
        },
        login: (mobileNo, confirmationCode) => {
            //login API call code here...
            let loginResult = true;
            if (loginResult) {
                setLoggedInModel({
                    ...loggedInModel,
                    username: mobileNo,
                    loginUser: true,
                });
            }
            return loginResult;
        },

    });


    return (
        <AppContext.Provider value={{"loggedInModel": loggedInModel, "setLoggedInModel": setLoggedInModel}}>
            <HashRouter>
                <Switch>
                    <Route path="/userpanel">
                        <UserPanel username={loggedInModel.username}/>
                    </Route>
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </HashRouter>
        </AppContext.Provider>
    );
}


