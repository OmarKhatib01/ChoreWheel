import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApartmentTaskList from '../components/ApartmentTaskList';
import UserTaskList from '../components/UserTaskList';
import UserButtonGroup from '../components/UserButtonGroup';
import AddTask from '../components/TaskManagement';
import AddUser from '../components/UserManagement';
import { BiBuildingHouse } from 'react-icons/bi';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ApartmentPage = () => {
    const { id } = useParams(); // Get the apartment ID from the URL
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [apartment, setApartment] = useState(null);
    const [user, setUser] = useState(null);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);

    const handleAddUserClose = () => setShowAddUserModal(false);
    const handleAddUserShow = () => setShowAddUserModal(true);
    const addUserToState = (newUser) => {
        setUsers([...users, newUser]);
    };

    const handleAddTaskClose = () => setShowAddTaskModal(false);
    const handleAddTaskShow = () => setShowAddTaskModal(true);
    const addTaskToState = (newTask) => {
        setTasks([...tasks, newTask]); // Update tasks state with the new task
    };

    const updateTaskInState = (updatedTask) => {
        const updatedTasks = tasks.map(task => {
            if (task.TaskID === updatedTask.TaskID) {
                return updatedTask; // Update the task with the new data
            }
            return task; // Keep the other tasks as they are
        });
        setTasks(updatedTasks); // Set the new tasks array
        
    };

    const deleteTaskFromState = (deletedTaskId) => {
        const remainingTasks = tasks.filter(task => task.TaskID !== deletedTaskId);
        setTasks(remainingTasks);
    };
    useEffect(() => {
        const fetchApartmentData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/apartments/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                const data = await response.json();
                setApartment(data);
            } catch (error) {
                console.error('Error fetching apartment:', error);
            }
        };

        const fetchUsersData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/apartments/${id}/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchTasksData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/apartments/${id}/tasks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchApartmentData();
        fetchUsersData();
        fetchTasksData();
    }, [id]);
    
    if (!apartment) return <h1>Loading...</h1>;

    return (
        <div>
            <h1 className="text-center">
                <BiBuildingHouse />
            </h1>
            <div className='text-center'>
                <h1>Name: {apartment.name}</h1>
                <h2>Address: {apartment.address}</h2>
            </div>

            {/* Diplay Users */}
            <UserButtonGroup
                currUser={user}
                users={[{ id: null, name: 'View All' }, ...users.map(user => ({ id: user.UserID, name: user.Name }))]}
                setUser={setUser}
            >
                {/* Add Task Button */}
                <button className="btn btn-success fw-bold m-2" onClick={handleAddTaskShow}>
                    Add Task
                </button>
                {/* Add User Button */}
                <button className="btn btn-success fw-bold m-2" onClick={handleAddUserShow}>
                    Add User
                </button>
            </UserButtonGroup>

            {/* Add Task Modal */}
            <AddTask show={showAddTaskModal} handleClose={handleAddTaskClose} users={users} aptId={id} onTasksAdded={addTaskToState} />
            {/* Add User Modal */}
            <AddUser show={showAddUserModal} handleClose={handleAddUserClose} aptId={id} onUserAdded={addUserToState} />

            {/* Display Tasks */}
            {
                user
                ? <UserTaskList aptId={id} UserID={user} onTasksAdded={addTaskToState} tasks={tasks.filter(task => String(task.UserID) === String(user))
                } updateTask={updateTaskInState} deleteTask={deleteTaskFromState} users={users} />
                : <ApartmentTaskList tasks={tasks} aptId={id} onTasksAdded={addTaskToState} updateTask={updateTaskInState} deleteTask={deleteTaskFromState} users={users}/>

            }


        </div>
    );
};

export default ApartmentPage;
