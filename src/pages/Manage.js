import React from "react";
import AppBtn from "../components/AppBtn";
import { Link, useHistory } from 'react-router-dom'
import TeamAdmin from "../components/TeamAdmin";
import useAppContext from "../hooks/AppContext";

import { ReactComponent as PasswordIcon } from "../icons/password.svg";
import { ReactComponent as TerminateIcon } from "../icons/terminate.svg";

import "./Manage.css";

const Manage = () => {
  const { user } = useAppContext();
  
  const pathPassword = `/creator/password`;
  const pathTerminate = `/creator/terminate`;
  const history = useHistory();
  const goTo = (path) => {
    history.push(path);
  }

  //Routing helpers shall ensure that we never end up here with user==null, but...
  if (!user) return <></>;

  return (
  <>
    <h1>Manage account and teams</h1>
    <div className="Manage-account">
      <h3><em>{user.email}</em></h3>
      <ul>
        <li>
          <div className="Manage-account-link">
            <AppBtn onClick={() => goTo(pathPassword)}>
              <PasswordIcon />
            </AppBtn>
            <p><Link to={pathPassword}>Change</Link> your account password</p>
          </div>
        </li>
        <li>
          <div className="Manage-account-link">
            <AppBtn onClick={() => goTo(pathTerminate)}>
              <TerminateIcon />
            </AppBtn>
            <p><Link to={pathTerminate}>Terminate</Link> your account and delete all data</p>
          </div>
        </li>      
      </ul>
    </div>
    <h3>Your teams</h3>
    <TeamAdmin user={user} />
  </>      
  );
};

export default Manage;
