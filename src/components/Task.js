import { Dropdown } from "react-bootstrap";
import './dropdown.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Task = ({ aptId, task, updateTask, deleteTaskFromState, users }) => {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + task.DaysRemaining);

  const isCompleted = Boolean(task.Completed);

  const toggleCompletion = () => {
    fetch(`${API_BASE_URL}/apartments/${aptId}/tasks/${task.TaskID}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ completed: !isCompleted }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        updateTask({ ...task, Completed: !isCompleted });
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const deleteTask = (aptId, taskId) => {
    console.log('Deleting task:', taskId);
    fetch(`${API_BASE_URL}/apartments/${aptId}/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        deleteTaskFromState(taskId);
        alert('Task deleted successfully');
      })


      .catch(error => console.error('Error deleting task:', error));
  }

  // get user name from user id
  const getUserName = (userId) => {
    const user = users.find(user => String(user.UserID) === String(userId));
    return user ? user.Name : '';
  }

  return (
    <div
      className={`card m-2 p-2 col-lg-8 mx-auto ${task.Completed ? 'border-success bg-success bg-opacity-25' : task.DaysRemaining <= 1 && task.DaysRemaining >= 0 ? 'border-warning bg-warning bg-opacity-25' : task.DaysRemaining < 0 ? 'border-danger bg-danger bg-opacity-25' : 'border-dark'}`}
      style={{ borderWidth: '4px' }} >
      <div className="d-flex justify-content-between align-items-center">
        <div className="card-body">
          <div className="card-title">
            <b>Task:</b> {task.Title}
          </div>
          <div className="card-text">
            <b>Due:</b> {dueDate.toDateString()}
          </div>
          <div className="card-text">
            <b>Interval:</b> {task.IntervalDays} days
          </div>
          <div className="card-text">
            <b>Assigned to:</b> {getUserName(task.UserID)}
          </div>
        </div>
        <input type="checkbox" checked={isCompleted} onChange={toggleCompletion} />

        <Dropdown className="align-self-start dropdown-toggle">
          <Dropdown.Toggle variant="outline-secondary"
            style={{ border: 'none', fontWeight: '900' }}
            id="dropdown-basic"
            size="sm">
            &#x00b7;&#x00b7;&#x00b7;
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => deleteTask(aptId, task.TaskID)}>Delete Task</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

    </div>
  );
};

export default Task;
