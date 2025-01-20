const Form = document.querySelector('form');
const Input = document.getElementById('txtInputID');
const List = document.getElementById('listID');

let TaskArray = getTasks();
updateTaskList();

Form.addEventListener('submit', function(e){
    e.preventDefault();
    addTask();
})

function addTask(){
    const TaskText = Input.value.trim();

    if(TaskText.length > 0){
        const taskObject = {
            text: TaskText,
            completed: false
        }

        TaskArray.push(taskObject);
        updateTaskList();
        saveTasks();

        Input.value = "";
    } 
    else{
        alert("Please enter a task");
    } 
}

function updateTaskList(){
    List.innerHTML = "";

    TaskArray.forEach((task, index)=>{
        Item = createTaskItem(task, index);
        List.append(Item);
    })
}

function createTaskItem(task, index){
    const taskid = "task-"+index;
    const litask = document.createElement("li");
    const TaskText = task.text;

    litask.className = "cTask";
    
    litask.innerHTML = `
        <input type="checkbox" id="${taskid}">
        <label class="cCheckbox" for="${taskid}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
        </label>
        <label for="${taskid}" class="cTaskText">
            ${TaskText}
        </label>
        <button class="cDelete">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
    `
    const deleteButton = litask.querySelector(".cDelete");
    deleteButton.addEventListener("click", ()=>{
        deleteTaskItem(index);
    })

    const checkbox = litask.querySelector("input");
    checkbox.addEventListener("change", ()=>{
        TaskArray[index].completed = checkbox.checked;
        saveTasks();
    })

    checkbox.checked = task.completed;
    return litask;
}

function deleteTaskItem(TaskIndex){
    TaskArray = TaskArray.filter((_, i)=> i !== TaskIndex);
    saveTasks();
    updateTaskList();
}

function saveTasks(){
    const TasksJson = JSON.stringify(TaskArray);
    localStorage.setItem("Tasks", TasksJson);
}

function getTasks(){
    const Tasks = localStorage.getItem("Tasks") || "[]";
    return JSON.parse(Tasks);
}

