import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";



export default function Navbar() {
    const [account, setAccount] = useState({ savings: 0, checking: 0 });

    useEffect(() => {
        async function fetchAccount() {
            const response = await fetch("http://localhost:5000/users/getUserBySession", { //had to get the current user using the session by getting the email
                credentials: 'include'
            });

            const account = await response.json();
            setAccount(account);
        }

        fetchAccount();
    }, [account]);

    return (
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <Link to="/AccountSummary"><div class="navbar-brand">MoneyMania</div></Link>
                {account != null &&
                    <div class="collapse navbar-collapse">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Link to="/AccountSummary">
                                    <div class="nav-link">Summary</div>
                                </Link>
                            </li>
                        </ul>
                        <ul class="nav navbar-nav navbar-right">
                            <li>
                                <Link to="/Logout">
                                    <div class="nav-link" >Log Out</div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                }
            </div>
        </nav>
    );
};