const Form = document.querySelector('form');
const Input = document.getElementById('txtInputID');
const List = document.getElementById('listID');

let TaskArray = []; 
updateTaskList();

// Fetch tasks
const fetchTasks = async () => {
  try {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    TaskArray = tasks;
    updateTaskList();
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};


Form.addEventListener('submit', function(e){
    e.preventDefault();
    addTask();
});

// Add a new task
async function addTask(){
    const TaskText = Input.value.trim();

    if(TaskText.length > 0){
        const taskObject = {
            text: TaskText,
            completed: false
        };

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskObject)
            });

            const newTask = await response.json();
            TaskArray.push(newTask);
            updateTaskList(); 
            Input.value = ""; 
        } catch (error) {
            console.error("Error adding task:", error);
        }
    } else {
        alert("Please enter a task");
    }
}

// Update the task
function updateTaskList(){
    List.innerHTML = "";

    TaskArray.forEach((task) => {
        const Item = createTaskItem(task);
        List.append(Item);
    });
}

// Create a list item for each task
function createTaskItem(task){
    const taskid = "task-" + task.id;  // Use the task's ID
    const litask = document.createElement("li");
    const TaskText = task.text;

    litask.className = "cTask";

    litask.innerHTML = `
        <input type="checkbox" id="${taskid}" ${task.completed ? 'checked' : ''}>
        <label class="cCheckbox" for="${taskid}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
        </label>
        <label for="${taskid}" class="cTaskText">${TaskText}</label>
        <button class="cDelete">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
    `;

    const deleteButton = litask.querySelector(".cDelete");
    deleteButton.addEventListener("click", () => {
        deleteTaskItem(task.id); 
    });

    const checkbox = litask.querySelector("input");
    checkbox.addEventListener("change", () => {
        updateTaskCompletionStatus(task.id, checkbox.checked);
    });

    return litask;
}

// Update the task
async function updateTaskCompletionStatus(taskId, completed) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        });

        const updatedTask = await response.json();
       
        const taskIndex = TaskArray.findIndex(task => task.id === taskId);
        TaskArray[taskIndex] = updatedTask;
        updateTaskList(); 
    } catch (error) {
        console.error("Error updating task completion status:", error);
    }
}

// Delete a task
async function deleteTaskItem(taskId){
    try {
        await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        TaskArray = TaskArray.filter(task => task.id !== taskId);
        updateTaskList(); 
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

fetchTasks();
