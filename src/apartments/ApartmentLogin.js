import React from 'react';
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const loginAptData = async (onLogin, navigate) => {
  const aptName = document.querySelector("#apt_name_input").value.trim();
  const password = document.querySelector("#apt_password_input").value.trim();

  if (aptName === '' || password === '') {
    alert('Please enter both an apartment name and password');
    return;
  }

  fetch(`${API_BASE_URL}/apartment/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: aptName, password: password }),
  })
  .then(response => {
    if (!response.ok) {
      alert('Incorrect apartment name or password, please try again.');
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem('id', data.id);
    localStorage.setItem('authToken', data.authToken);
    onLogin(data.id);
    navigate(`/apartment/${data.id}`)
  })
  .catch(error => {
    console.error('Error logging in to apartment:', error);
  });
};

const ApartmentLoginButton = ({ onLogin }) => {
  const navigate = useNavigate();
  return(
  <button type="button"
    className="btn btn-primary"
    onClick={() => loginAptData(onLogin, navigate)}>
    Log in to Apartment
  </button>
  );
};

const ApartmentLogin = ({ onLogin }) => {
  const navigate = useNavigate();

  return (
    <div className='row'>
      <form className="container p-2 bg-light mt-5 rounded p-3 col-12 col-md-8 col-lg-4 ">
        <h3 className='text-center'>Log in to Your Apartment</h3>
        <br />
        <div className="form-group">
          <label htmlFor="apt_name_input" className='mb-2 fw-bold'>Apartment Name</label>
          <input type="text"
            className="form-control mb-4 mx-auto"
            id="apt_name_input"
            placeholder="Enter Apartment Name" />
        </div>
        <div className="form-group">
          <label htmlFor="apt_password_input" className='mb-2 fw-bold'>Apartment Password</label>
          <input type="password"
            className="form-control mb-4 mx-auto"
            id="apt_password_input"
            placeholder="Enter Apartment Password" />
        </div>
        <div className='d-flex justify-content-end'>
          <ApartmentLoginButton onLogin={onLogin} />
        </div>
        <br />
        <div className='d-flex justify-content-end'>
          <p className="m-0 mt-1">
            Don't have an apartment?
            <a className="mx-2" href="/signup" onClick={() => navigate('/signup')}>
              Create a new one here!
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ApartmentLogin;
