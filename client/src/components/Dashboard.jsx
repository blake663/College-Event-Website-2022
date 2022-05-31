import React, { Fragment, useState } from "react";
import CreateRSO from "./CreateRSO";
import InputLocation from "./InputLocation";
import EventList from "./EventList";
import CreateEvent from "./CreateEvent";
import Clubs from "./Clubs";


const Dashboard = ({ email, handleLogOut }) => {


  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a href="#" className="navbar-brand">Frontend Bootcamp</a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse ms-auto" id="navbar-menu">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a href="#learn" className="nav-link">What You'll Learn</a>
              </li>
              <li className="nav-item">
                <a href="#questions" className="nav-link">Questions</a>
              </li>
              <li className="nav-item">
                <a href="#instructors" className="nav-link">Instructors</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* <nav className="navbar navbar-light bg-light px-2">
        <h3>Hi {email}</h3>
        <button className="btn-sm btn btn-outline-secondary" type="button" onClick={handleLogOut}>Log Out</button>
      </nav> */}
      <h1 className="my-3">Dashboard</h1>
      <InputLocation />
      <CreateRSO email={email} />
      <CreateEvent email={email} />
      <EventList email={email} />
      <Clubs email={email} />
    </Fragment>    
  )
}

export default Dashboard;