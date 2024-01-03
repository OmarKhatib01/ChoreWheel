import Task from "./Task";

const ApartmentTaskList = ({ aptId, tasks, updateTask, deleteTask, users }) => {
    return (
        <div>
            {tasks.map((task, idx) => (
                <Task key={task.TaskID} aptId={aptId} task={task} updateTask={updateTask} deleteTaskFromState={deleteTask} users={users} />
            ))}
        </div>
    );
};

export default ApartmentTaskList;
