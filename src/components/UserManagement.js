import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AddUser = ({ show, handleClose, aptId, onUserAdded}) => {
  const [userName, setUserName] = useState('');

  const createUser = (name, aptId) => {
    fetch(`${API_BASE_URL}/apartments/${aptId}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ name }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      const newUser = { UserID: data.id, Name: data.name}
      onUserAdded(newUser); // Add the new user to the list of users and update state of apartment page
      handleClose(); // Close the modal and reset the form
      setUserName(''); // Reset the input field
    })
    .catch(error => {
      console.error('Error adding user:', error);
    });
  };

  const validateForm = () => {
    const name = userName.trim();
    if (!name) {
      alert("Please enter a user name.");
      return;
    }
    createUser(name, aptId);
  };

  return (
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header>
        <Modal.Title>Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group p-2">
            <label htmlFor="userName">New User:</label>
            <input 
              className="form-control" 
              id="userName" 
              placeholder="User name" 
              maxLength={50} 
              value={userName} 
              onChange={(e) => setUserName(e.target.value)} />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className='btn btn-secondary' onClick={handleClose}>
          Close
        </button>
        <button className='btn btn-primary' onClick={validateForm}>
          Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddUser;
