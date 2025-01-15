function displaydate(){
    let date = new Date()
    date = date.toDateString().split(" ")
    document.querySelector("#date").innerHTML = date[1] + " " + date[2] + " " + date[3]
}

window.onload = function(){
    displaydate()
}