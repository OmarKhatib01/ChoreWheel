import Task from "./Task";

const UserTaskList = ({ aptId, UserID, tasks, updateTask, deleteTask, users }) => {
  console.log('UserTaskList:', tasks);
  return (
    <div>
      {tasks.length === 0 ? <h3 className="text-center">No Assigned Tasks</h3> : tasks.map((task, idx) => (
        <Task key={idx} aptId={aptId} UserID={UserID} task={task} updateTask={updateTask}  deleteTaskFromState={deleteTask} users={users}/>
      ))}
    </div>
  );
};

export default UserTaskList;