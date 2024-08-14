import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Fill with real date for second assingment
const Record = (props) => (
  <tr>
    <td>May 20, 2023</td>
    <td>12:00PM</td>
    <td>Savings</td>
    <td>Checking</td>
    <td>15</td>

  </tr>
);

export default function Records() {
  const [record, setRecord] = useState(null);

  useEffect(() => {
    async function getRecord() {
      const response = await fetch(`http://localhost:5000/users/getUserBySession`, {
        credentials: 'include'
      });

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const fetchedRecord = await response.json();
      setRecord(fetchedRecord);
    }

    getRecord();
  }, []);
//This is why I am NOT going into the UX field, it works, but more i expermited with it the worst it got
  return (
    <div className="d-flex justify-content-center align-items-center vh-10">
      <div>
        <ul className="list-unstyled d-flex justify-content-between">
          <li><h3 className="pl-3">Transaction History </h3></li>
        </ul>
        <br />
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {record ? <Record record={record}  /> : (
              <tr>
                <td colSpan="5" className="text-center">Loading...</td>
              </tr>
            )}
          </tbody>
        </table>
        <button><Link to="/Money" style={{ textDecoration: 'none', color: 'inherit'}}>Go Back</Link></button>

      </div>
    </div>
  );
}
