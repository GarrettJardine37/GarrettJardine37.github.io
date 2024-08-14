import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

export default function Logout() {
    const [status, setStatus] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        async function run() {
            const response = await fetch(`http://localhost:5000/session_delete`, {
                method: "GET",
                credentials: 'include'
            });

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const statusResponse = await response.json();
            setStatus(statusResponse.status);
            navigate("/");
        }

        run();
        return;
    }, [navigate]);

    return (
        <div className="logout-container">
            <h3>Logout</h3>
            <p>{status}</p>
        </div>
    );
}
