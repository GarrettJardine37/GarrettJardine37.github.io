import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import './styles.css'; 


export default function Register(){
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "Admin" //default value is Admin

    })

    const navigate = useNavigate()

    function updateForm(jsonObject){
        return setForm((prevJsonObject) => {
            return { ...prevJsonObject, ...jsonObject};
        })
    }

    async function onSubmit(e){
        e.preventDefault()
        const newPerson = {...form};
        const response = await fetch("http://localhost:5000/users/addUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPerson),

        })
        .catch(error => {
            window.alert(error);
            return;
        });
        console.log(response)

        if(!response.ok){
            window.alert("Please try a different email")
        }
        else{
            navigate("/AccountSummary")

        }
        setForm({ firstName: "", lastName: "", email:"", phone:"", password:""});
    }


    return (
        <div>
            <h3>account registration</h3>
            <p>Create Account</p>
            <form onSubmit={onSubmit}>
                <div>
                    <label>First Name: </label>
                    <input type="text"
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => updateForm({firstName: e.target.value })}/>
                </div>
                <div>
                    <label>Last Name: </label>
                    <input type="text"
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => updateForm({lastName: e.target.value })}/>
                </div>
                <div>
                    <label>Email: </label>
                    <input type="text"
                    id="email"
                    value={form.email}
                    onChange={(e) => updateForm({email: e.target.value })}/>
                </div>
                <div>
                    <label>Phone Number: </label>
                    <input type="text"
                    id="phoneNumber"
                    value={form.phoneNumber}
                    onChange={(e) => updateForm({phoneNumber: e.target.value })}/>
                </div>
                <div>
                    <label>Password: </label>
                    <input type="text"
                    id="password"
                    value={form.password}
                    onChange={(e) => updateForm({password: e.target.value })}/>
                </div>
                <br />
                <div>
                    <input type="submit" value="Create Account"/>
                </div>
            </form>
        </div>
    );
}