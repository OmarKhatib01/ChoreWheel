import React from 'react';
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const createAptData = async (onSignUp, navigate) => {
  const name = document.querySelector("#apt_name_input").value.trim();
  const address = document.querySelector("#apt_address_input").value.trim();
  const password = document.querySelector("#apt_password_input").value.trim();

  if (name === '' || password === '') {
    alert('Please enter both an apartment name and password');
    return;
  }

  console.log('Sending data:', JSON.stringify({ name, address, password }));
  fetch(`${API_BASE_URL}/apartment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: JSON.stringify({ name, address, password }),
  })
    .then(response => {
      if (!response.ok) {
        alert('Apartment name already exists, please try again.');
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      navigate(`/apartment/${data.id}`)
    })
    .catch(error => {
      console.error('Error creating apartment:', error);
    });
};

const ApartmentCreateButton = ({ onSignUp }) => {
  const navigate = useNavigate();

  return (
    <button type="button" className="btn btn-primary" onClick={() => createAptData(onSignUp, navigate)}>
      Create New Apartment
    </button>
  );
}

const ApartmentCreation = ({ onSignUp }) => {
  const navigate = useNavigate();

  return (
    <div className='row'>
      <form className="container p-2 bg-light mt-5 rounded p-3 col-12 col-md-8 col-lg-4 ">
        <h3 className='text-center'>Create a New Apartment</h3>
        <br />
        <div className="form-group">
          <label htmlFor="apt_name_input" className='mb-2 fw-bold'>Apartment Name</label>
          <input type="text"
            className="form-control mb-4 mx-auto"
            id="apt_name_input"
            placeholder="Enter new Apartment Name" />
        </div>
        <div className="form-group">
          <label htmlFor="apt_address_input" className='mb-2 fw-bold'>Apartment Address</label>
          <input type="text"
            className="form-control mb-4 mx-auto"
            id="apt_address_input"
            placeholder="Enter Apartment Address" />
        </div>
        <div className="form-group">
          <label htmlFor="apt_password_input" className='mb-2 fw-bold'>Apartment Password</label>
          <input type="password"
            className="form-control mb-4 mx-auto"
            id="apt_password_input"
            placeholder="Enter Apartment Password" />
        </div>
        <div className='d-flex justify-content-end'>
          <ApartmentCreateButton onSignUp={onSignUp} />
        </div>
        {/* ... rest of your component ... */}
        <br />
        <div className='d-flex justify-content-end'>
          <p className="mt-1">
            Already have an apartment?
            <a className="mx-2" href="/login" onClick={() => navigate('/login')}>
              Log in here!
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default ApartmentCreation;