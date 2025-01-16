
const itemsArray = localStorage.getItem("items") ? JSON.parse(localStorage.getItem("items")):[]

console.log(itemsArray)

function displaydate(){
    let date = new Date()
    date = date.toDateString().split(" ")
    document.querySelector("#date").innerHTML = date[1] + " " + date[2] + " " + date[3]
}

window.onload = function(){
    displaydate()
    displayitem()
}

document.querySelector("#enter").addEventListener("click", () =>{
    const item = document.querySelector("#item")
    createItem(item)
})

function createItem(item)
{
    itemsArray.push(item.value)
    localStorage.setItem("items", JSON.stringify(itemsArray))
    location.reload()
}

function displayitem()
{
    let items = ""
    for(let i = 0; i < itemsArray.length; i++)
    {
       items += `<div class="item">
        <div class="input-controller">
            <textarea disabled placeholder="nothing">${itemsArray[i]}</textarea>
            <div class="edit-controller">
                <i class="fa-solid fa-trash deleteBtn"></i>
                <i class="fa-solid fa-pen-to-square editBtn"></i>
            </div>
        </div>
        <div class="update-controller">
            <button class="saveBtn">Save</button>
            <button class="cancelBtn">Cancel</button>
        </div>
        </div>`
    }
    document.querySelector(".to-do").innerHTML = items
    activateDeleteListen()
    activateEditListen()
    activateSaveListen()
    activateCancelListen()
}



function activateDeleteListen(){
    let deletebtn = document.querySelectorAll(".deleteBtn")
    deletebtn.forEach((db, i) =>{
        db.addEventListener("click", () => {deleteitem(i)})
    })
}
function deleteitem(i){
    itemsArray.splice(i, 1)
    localStorage.setItem("items", JSON.stringify(itemsArray))
    location.reload()
}
function   activateEditListen(){
    const editBtn = document.querySelectorAll(".editBtn")
    const updateController = document.querySelectorAll(".update-controller")
    const inputs = document.querySelectorAll(".input-controller textarea")
    editBtn.forEach((eb, i) =>{
        eb.addEventListener("click", () => {
            updateController[i].computedStyleMap.display = "block"
            inputs[i].disabled = false
        })
    })
}
function   activateSaveListen(){
    const saveBtn = document.querySelectorAll(".saveBtn")
    const inputs = document.querySelectorAll(".input-controller textarea")

    saveBtn.forEach((sb, i) => {
        saveBtn.addEventListener("click", () =>{
            updateitem(inputs[i].value, i)
        })
    })

}
function  activateCancelListen(){
    const cancelBtn = document.querySelectorAll(".cancelBtn")
    const updateController = document.querySelectorAll(".update-controller")
    const inputs = document.querySelectorAll(".input-controller textarea")

    saveBtn.forEach((sb, i) => {
        saveBtn.addEventListener("click", () =>{
            updateitem(inputs[i].value, i)
        })
    })
}