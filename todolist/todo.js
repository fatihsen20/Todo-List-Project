const form=document.querySelector("#todo-form");
const todoInput=document.querySelector("#todo");
const todoList=document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners(){//Tüm fonksiyonlar burada çalışacak
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodo);
    filter.addEventListener("keyup",Filtertodos);
    clearButton.addEventListener("click",clearAllTodos);
}
function clearAllTodos(){
    if(confirm("tüm tasklar silinecek emin misin?")){
        while(todoList.firstElementChild!=null)
            todoList.removeChild(todoList.firstElementChild);
        localStorage.removeItem("todos");
    }
}
function Filtertodos(e){
    const filterValue=e.target.value.toLowerCase();
    const listitems=document.querySelectorAll(".list-group-item");
    listitems.forEach(function(listitem){
        const text=listitem.textContent.toLowerCase();
        if(text.indexOf(filterValue)===-1){
            listitem.setAttribute("style","display : none !important");
        }
        else{
        listitem.setAttribute("style","display : block");
        }

    });
}
function deleteTodo(e){
    if(e.target.className==="fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        let goster=e.target.parentElement.parentElement.textContent;
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success",`${goster} başarıyla silindi!`);
    }
}
function deleteTodoFromStorage(deletetodo){
    let todos=getTodosFromStorage();
    todos.forEach(function(todo,index){
        if (todo===deletetodo){
            todos.splice(index,1);
        }
    });
    localStorage.setItem("todos",JSON.stringify(todos));
}
function loadAllTodosToUI(){
    let todos=getTodosFromStorage();
    todos.forEach(function(todo){
        addTodoToUI(todo);
    })
}
function addTodo(e){
    const newtodo=todoInput.value.trim();
    let todos=getTodosFromStorage();
    let flag=false;
    todos.forEach(function(todo){
        if (newtodo===todo){
            showAlert("danger","Lütfen var olmayan bir todo giriniz!");
            flag=true;
        }
    });
    if(newtodo!="" && !flag){
        addTodoToUI(newtodo);
        showAlert("success",`${newtodo} Başarıyla Eklendi!`);
        addTodoToStorage(newtodo);  
    }
    else{
        if(!flag)
            showAlert("danger","Lütfen bir todo giriniz!");
    }
    e.preventDefault();
}
function getTodosFromStorage(){ //Storage'dan todoları almayı sağlar
    let todos;
    if(localStorage.getItem("todos")===null){
        todos=[];
    }
    else{
        todos=JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}
function addTodoToStorage(newtodo){
    let todos=getTodosFromStorage();
    todos.push(newtodo);
    localStorage.setItem("todos",JSON.stringify(todos));
}
function showAlert(type,message){
    const alert=document.createElement("div");
    alert.className=`alert alert-${type}`;
    alert.textContent=message;
    firstCardBody.appendChild(alert);
    setTimeout(function(){
        alert.remove();

    },2000);
}
function addTodoToUI(newtodo){// String değerini list item olarak UI'ya ekleyecek.
    // List Item Oluşturma
    const listItem=document.createElement("li");
    //Link Oluştruma
    const link=document.createElement("a");
    link.href="#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";
    listItem.className = "list-group-item d-flex justify-content-between";
    //Textnode ekleme
    listItem.appendChild(document.createTextNode(newtodo));
    listItem.appendChild(link);
    //TodoList'e list item ekleme
    todoList.appendChild(listItem);
    todoInput.value = "";
}