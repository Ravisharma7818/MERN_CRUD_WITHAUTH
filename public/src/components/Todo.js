//  Advanced Todo With LocalStorage Saved 
import React, { useEffect } from "react";

import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import {  useState } from "react";
import '../app.css'
export default function App() {

  


  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);

  useEffect(() => {
    const verifyUser = async () => {
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          {
            withCredentials: true,
          }
        );
        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else
          toast(`Hi ${data.user} `, {
            theme: "light",
          });
      }
    };
    verifyUser();
  }, [cookies, navigate, removeCookie]);
  const logOut = () => {
    removeCookie("jwt");
    navigate("/login");
  };
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      return JSON.parse(savedTodos);
    } else {
      return [];
    }
  });
  const [todo, setTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});

  
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleInputChange(e) {
    setTodo(e.target.value);
  }

  function handleEditInputChange(e) {

    setCurrentTodo({ ...currentTodo, text: e.target.value });
    console.log(currentTodo);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (todo !== "") {
      setTodos([
        ...todos,
        {
          id: todos.length + 1,
          text: todo.trim()
        }
      ]);
    }

    setTodo("");
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();

    handleUpdateTodo(currentTodo.id, currentTodo);
  }

  function handleDeleteClick(id) {
    const removeItem = todos.filter((todo) => {
      return todo.id !== id;
    });
    setTodos(removeItem);
  }

  function handleUpdateTodo(id, updatedTodo) {



    const updatedItem = todos.map((todo) => {
      return todo.id === id ? updatedTodo : todo;
    });

    setIsEditing(false);

    setTodos(updatedItem);
  }

  function handleEditClick(todo) {

    setIsEditing(true);

    setCurrentTodo({ ...todo });
  }


  return (

    <>
    <div className="App">
      {isEditing ? (
    
    
        <form onSubmit={handleEditFormSubmit}>
  
          <h2>Edit Todo</h2>
  
          <label htmlFor="editTodo">Edit todo: </label>
  
  
          <input
          className="Inputs"
            name="editTodo"
            type="text"
            placeholder="Edit todo"
            value={currentTodo.text}
            onChange={handleEditInputChange}
          />
  
          <button type="submit">Update</button>
  
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
    
    
        <form onSubmit={handleFormSubmit}>
  
          <h1>Crud App</h1>
  
       
  
  
          <input
          className="Inputs"

            name="todo"
            type="text"
            placeholder="Create a new todo"
            value={todo}
            onChange={handleInputChange}
          />
  
          <button type="submit">Add</button>
        </form>
      )}
<br></br>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-lists">
          <br></br>
            {todo.text}
            <br></br>
    
            <button  className="editDeleteButt" onClick={() => handleEditClick(todo)}>Edit</button>
            <button className="editDeleteButt" onClick={() => handleDeleteClick(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

    </div>


    
        <h1>Super Secret Page</h1>
        <button onClick={logOut}>Log out</button>
       <ToastContainer />
    </>
  );
}