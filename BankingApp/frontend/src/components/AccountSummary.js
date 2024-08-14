import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// component to display a single record
const Record = ({ record, onRoleChange }) => {
  const [role, setRole] = useState(record.role);

  //this role change actually changes the value at the database
  const handleRoleChange = async (event) => {
    //event.target gives you the element that triggered the event.
    //So, event.target.value retrieves the value of that element (an input field, in your example).
    //https://stackoverflow.com/questions/67014481/what-is-event-target-value-in-react-exactly
    const newRole = event.target.value;
    setRole(newRole);
    onRoleChange(record.email, newRole);

    try {
      const response = await fetch(`http://localhost:5000/users/updateRole/${record.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <tr>
      <td>{record.accountNumber}</td>
      <td>{record.firstName}</td>
      <td>{record.lastName}</td>
      <td>{record.email}</td>
      <td>
        <select value={role} onChange={handleRoleChange}> 
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
          <option value="Employee">Employee</option>
        </select>
      </td>
      <td><Link to={"/Money"}>Account Information</Link></td>
    </tr>
  );
};

export default function Records() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getRecord() {
      const response = await fetch(`http://localhost:5000/users/listAllUsers`, { 
        credentials: 'include'
      });

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const fetchedRecords = await response.json();
      setRecords(fetchedRecords);
    }
    getRecord();
  }, []);

  //this role change changes the value on the display
  const handleRoleChange = (email, newRole) => {
    setRecords(records => records.map(record => {
      if (record.email === email) {
        return { ...record, role: newRole }; //if te records email matches the new email, make a new record with the new role
      }
      else {
        return record //else, just return the record
      }
    }));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-10">
      <div>
        <ul className="list-unstyled d-flex justify-content-between">
          <li><h3 className="pl-3">Admin Details</h3></li>
        </ul>
        <br />
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Id</th>
              <th>first Name</th>
              <th>Roles</th>
              <th>Change Role</th>
              <th>Checking/Savings</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <Record key={record._id} record={record} onRoleChange={handleRoleChange} /> //Why the key is needed https://stackoverflow.com/questions/68014046/warning-each-child-in-a-list-should-have-a-unique-key-prop-but-i-have-key-pro 
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
