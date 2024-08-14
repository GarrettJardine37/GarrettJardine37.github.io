import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    function updateForm(jsonObject) {
        return setForm((prevJsonObject) => {
            return { ...prevJsonObject, ...jsonObject };
        });
    }

    async function onSubmit(e) {
        e.preventDefault();

        const userCredentials = { ...form };
        const response = await fetch("http://localhost:5000/users/validAccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userCredentials),
            credentials: 'include'
        }).catch(error => {
            window.alert(error);
            return;
        });

        const data = await response.json();

        console.log("Response message: " + data.message);

        if (!response.ok) {
            window.alert("Enter valid username or password");
        } else {
            const FetchedEmail = await fetch('http://localhost:5000/session_get_email', {
                credentials: 'include'
              });
              let userEmailParsed = await FetchedEmail.json()
              let userEmail = userEmailParsed.email
      
              //Get the users role
              const FetchedUserRole = await fetch(`http://localhost:5000/users/getRole/${userEmail}`)
              let userRoleParsed = await FetchedUserRole.json()
              let userRole = userRoleParsed.role

              if(userRole === 'Admin'){
                navigate("/AccountSummary");
              } else if (userRole === 'Employee'){
                navigate("/AccountSummary") //make it employee page, where they put in bank number and pulls up bank information
              }
              else if (userRole === 'Customer'){
                navigate("Money") //Make it customer page
              }
              else{
                window.alert("No Role Found");

              }

            setForm({ email: "", password: "" });
        }
    }

    return (
        <div className="login-container">
            <h2>Sign In</h2>
            <form onSubmit={onSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email: </label>
                    <input
                        type="email"
                        id="email"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                    />
                </div>
                <br />
                <div>
                    <input type="submit" value="Login" className="btn-login" />
                </div>
            </form>
            <h3>Or register an account</h3>
            <div>
                <p>
                    <Link to={"/Register"} className="link-register">Create Account</Link>
                </p>
            </div>
        </div>
    );
}
