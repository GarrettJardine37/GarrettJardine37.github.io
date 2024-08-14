import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';

import AccountSummary from "./components/AccountSummary.js";
import Logout from "./components/logout.js";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import Money from "./components/Money.js"
import TransactionHistory  from "./components/TransactionHistory.js";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/AccountSummary" element={<ProtectedRoute component={AccountSummary} allowedRoles={["Admin", "Employee"]}/> }  /> //set allowed roles for that site
        <Route path="/Money" element={<ProtectedRoute component={Money} allowedRoles={["Admin", "Employee", "Customer"]}/>} />
        <Route path="/TransactionHistory" element={<ProtectedRoute component={TransactionHistory} />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
};

const ProtectedRoute = ({ component: Component , allowedRoles}) => { //For future reference https://www.angularminds.com/blog/protected-routes-in-react-router-authentication-and-authorization
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        //Make sure if the active users is still logged on
        const response = await fetch('http://localhost:5000/session_get', {
          credentials: 'include'
        });

        //Get Users email to get there role
        const FetchedEmail = await fetch('http://localhost:5000/session_get_email', {
          credentials: 'include'
        });
        let userEmailParsed = await FetchedEmail.json()
        let userEmail = userEmailParsed.email

        //Get the users role
        const FetchedUserRole = await fetch(`http://localhost:5000/users/getRole/${userEmail}`)
        let userRoleParsed = await FetchedUserRole.json()
        let userRole = userRoleParsed.role

        if (response.status === 200 && allowedRoles.includes(userRole)) { //Check if the users cookie is still active & the users role matches the allowed roles for the website
          setIsAuthenticated(true);
        } else if (response.status === 400) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []);

  if (isAuthenticated === null) {
    return <div>Doing stuff in the background, please be patient for 0.000000000000001 of a second</div>; // Show loading while checking session, idk but it needs it
  }

  return isAuthenticated ? <Component /> : <Navigate to="/" />; //For future reference: https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/3818
};

export default App;
