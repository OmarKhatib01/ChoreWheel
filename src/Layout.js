import React from 'react';
import { FaDharmachakra } from 'react-icons/fa';

const Layout = ({ children, isLoggedIn, onLogout }) => (
  <div>
    <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light p-2">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="navbar-brand">
          <FaDharmachakra size="1.7em" style={{ color: '#d4af37', marginTop: '-.4em' }} />
          <span className="h2 mx-2 fw-bold">ChoreWheel</span>
        </div>

        <ul className="navbar-nav">
          {isLoggedIn ? (
            <li className="nav-item">
              <a className="nav-link" href="/" onClick={onLogout}>
                Logout
              </a>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  Login
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signup">
                  Sign Up
                </a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
    {children}
  </div>
);

export default Layout;
