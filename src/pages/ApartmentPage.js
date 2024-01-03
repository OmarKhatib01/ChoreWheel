import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ApartmentTaskList from '../components/ApartmentTaskList';
import UserTaskList from '../components/UserTaskList';
import UserButtonGroup from '../components/UserButtonGroup';
import AddTask from '../components/TaskManagement';
import AddUser from '../components/UserManagement';
import { BiBuildingHouse } from 'react-icons/bi';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';


// const getTask = (taskId, apt) => (
//   apt.tasks[taskId]
// );

// const filterList = (lst) => Object.fromEntries(Object.entries(lst).filter(([key, val]) => (key !== "-1")));
// const filterAptData = (aptData) => Object.fromEntries(Object.entries(aptData).map(([key, val]) => [key, filterList(val)]));
// const filterData = (data) => Object.fromEntries(Object.entries(data).map(([aptKey, aptData]) => [aptKey, filterAptData(aptData)]));

// function App() {
//   const [aptId, setApt] = useState(null); // null initially indicating no apartment selected
//   const [creatingApt, setCreatingApt] = useState(true); // Start with creating an apartment
//   const [user, setUser] = useState('');
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [show, setShow] = useState(false);
//   const [showUserAdd, setShowUserAdd] = useState(false);


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
        // Fetch and set apartment data for the given apartment ID
        fetch(`${API_BASE_URL}/apartments/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setApartment(data);
            })
            .catch(error => {
                console.error('Error fetching apartment:', error);
            });

        // Fetch and set users for the given apartment ID
        fetch(`${API_BASE_URL}/apartments/${id}/users`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

        // Fetch and set tasks for the given apartment ID
        fetch(`${API_BASE_URL}/apartments/${id}/tasks`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setTasks(data);
            })
            .catch(error => {
                console.error('Error fetching tasks:', error);
            });
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
