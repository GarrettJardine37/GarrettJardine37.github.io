import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


export default function AccountManagement() {
    const [account, setAccount] = useState({ savings: 0, checking: 0, investing: 0});
    const [amount, setAmount] = useState("");

    const [accountType, setAccountType] = useState("savings");
    const [accountType2, setAccountType2] = useState("checking");
    const [accountType3, setAccountType3] = useState("investing")

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAccount() {
            const response = await fetch("http://localhost:5000/users/getUserBySession", { //had to get the current user using the session by getting the email
                credentials: 'include'
            });

            const account = await response.json();
            setAccount(account);
        }

        fetchAccount();
    }, []);

    const Deposit = async () => {
        if (accountType === "savings") {

            const response = await fetch(`http://localhost:5000/banking/increaseSavings/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ savings: parseFloat(amount) }),
            });

            if (response.ok) {
                navigate("/AccountSummary");
            }
        }
        if (accountType === "checking") {

            const response = await fetch(`http://localhost:5000/banking/increaseChecking/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: parseFloat(amount) }),
            });

            if (response.ok) {
                navigate("/AccountSummary");
            }
        };
        if (accountType === "investing") {

            const response = await fetch(`http://localhost:5000/banking/increaseInvesting/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: parseFloat(amount) }),
            });

            if (response.ok) {
                navigate("/AccountSummary");
            }
        };
    }

    const Withdraw = async () => {
        if (accountType === "savings") {

            const response = await fetch(`http://localhost:5000/banking/withdrawSavings/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ savings: parseFloat(amount) }),
            });

            if (response.ok) {
                navigate("/AccountSummary");
            } else {
                window.alert("Can't go below 0")
            }
        }
        if (accountType === "checking") {

            const response = await fetch(`http://localhost:5000/banking/withdrawChecking/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: amount }),
            });

            if (response.ok) {
                navigate("/AccountSummary");
            } else {
                window.alert("You are already broke dude, please don't go below 0 please, you already had to get a car loan")
            }

        };
        if (accountType === "investing") { //CHANGE TO INVESTING

            const response = await fetch(`http://localhost:5000/banking/withdrawInvesting/${account.email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ checking: amount }),
            });

            if (response.ok) {
                navigate("/AccountSummary");
            } else {
                window.alert("You are already broke dude, please don't go below 0 please, you already had to get a car loan")
            }

        };
    };

    return (
        <div class="mx-5">
            <div class="text-start border-bottom">
                <h3 class="mt-4">Account Management</h3>
            </div>
            <div class="mt-3">
                <table class="table table-striped">
                    <tbody>
                        <tr>
                            <th>Savings: </th>
                            <td>{account.savings}</td>
                        </tr>
                        <tr>
                            <th>Checking: </th>
                            <td>{account.checking}</td>
                        </tr>
                        <tr>
                            <th>Investing: </th>
                            <td>{account.investing}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex justify-content-between my-4">
                    <label class="col">
                        Account:
                        <select class="mx-2" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                            <option value="savings">Savings</option>
                            <option value="checking">Checking</option>
                            <option value="investing">Investing</option>
                        </select>
                    </label>
                    <label class="flex-direction-end">
                        Amount:
                        <input
                            class="mx-2"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </label>
                </div>


                <button onClick={Deposit}>Deposit</button>
                <button onClick={Withdraw}>Withdraw</button>
                <button><Link to="/TransactionHistory" style={{ textDecoration: 'none', color: 'inherit' }}>Transaction History</Link></button>

                <div>
                    <br/>
                    <h2>Internal Transfer</h2>
                    <div className="d-flex justify-content-between my-0">
                        <label className="d-flex align-items-center">
                            From:
                            <select className="mx-2" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                                <option value="savings">Savings</option>
                                <option value="checking">Checking</option>
                                <option value="investing">Investing</option>
                            </select>
                        </label>
                        <label className="d-flex align-items-center">
                            To:
                            <select className="mx-2" value={accountType2} onChange={(e) => setAccountType(e.target.value)}>
                                <option value="savings">Savings</option>
                                <option value="checking">Checking</option>
                                <option value="investing">Investing</option>
                            </select>
                        </label>
                        <label className="d-flex align-items-center">
                            Amount:
                            <input
                                className="mx-2"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </label>
                    </div>
                    <button onClick={Deposit}>Submit</button>
                </div>

                {account.role != "Customer" &&
                    <div>
                        <br/>
                        <h2>External Transfer</h2>
                        <div className="d-flex justify-content-start my-0">
                            <label className="d-flex align-items-center me-3">
                                <label class="flex-direction-end">
                                From:
                                <input
                                    class="mx-2"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                                </label>
                                <label className="d-flex align-items-center">
                                    To:
                                    <input
                                        class="mx-2"
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </label>
                            </label>

                        </div>

                        <div className="d-flex justify-content-between my-0">
                            <label className="d-flex align-items-center">
                                From:
                                <select className="mx-2" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                                    <option value="savings">Savings</option>
                                    <option value="checking">Checking</option>
                                    <option value="investing">Investing</option>
                                </select>
                            </label>
                            <label className="d-flex align-items-center">
                                To:
                                <select className="mx-2" value={accountType2} onChange={(e) => setAccountType(e.target.value)}>
                                    <option value="savings">Savings</option>
                                    <option value="checking">Checking</option>
                                    <option value="investing">Investing</option>
                                </select>
                            </label>
                            <label className="d-flex align-items-center">
                                Amount:
                                <input
                                    className="mx-2"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </label>
                        </div>
                        <button onClick={Deposit}>Submit</button>
                    </div>
                }
            </div>
        </div>
    );
}
