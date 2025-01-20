const Form = document.querySelector('form');
const Input = document.getElementById('txtInputID');
const List = document.getElementById('listID');

let TaskArray = []; // Start with an empty array
updateTaskList();

// Fetch tasks from the server
const fetchTasks = async () => {
  try {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    TaskArray = tasks; // Update TaskArray with tasks from the server
    updateTaskList(); // Re-render the task list
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};

// Add event listener for form submission
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
            TaskArray.push(newTask); // Add the new task to the TaskArray
            updateTaskList(); // Re-render the task list
            Input.value = ""; // Clear input field
        } catch (error) {
            console.error("Error adding task:", error);
        }
    } else {
        alert("Please enter a task");
    }
}

// Update the task list displayed on the UI
function updateTaskList(){
    List.innerHTML = "";

    TaskArray.forEach((task, index) => {
        const Item = createTaskItem(task, index);
        List.append(Item);
    });
}

// Create a list item for each task
function createTaskItem(task, index){
    const taskid = "task-" + task.id;
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
        deleteTaskItem(task.id); // Delete task using task ID
    });

    const checkbox = litask.querySelector("input");
    checkbox.addEventListener("change", () => {
        updateTaskCompletionStatus(task.id, checkbox.checked);
    });

    return litask;
}

// Update the task completion status
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
        // Update the task in TaskArray
        const taskIndex = TaskArray.findIndex(task => task.id === taskId);
        TaskArray[taskIndex] = updatedTask;
        updateTaskList(); // Re-render the task list
    } catch (error) {
        console.error("Error updating task completion status:", error);
    }
}

// Delete a task from the list
async function deleteTaskItem(taskId){
    try {
        await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        TaskArray = TaskArray.filter(task => task.id !== taskId); // Remove the task from the array
        updateTaskList(); // Re-render the task list
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

// Initial fetch of tasks when the page loads
fetchTasks();



