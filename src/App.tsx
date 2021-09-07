import {useState, useEffect} from 'react';
import './App.css';


const baseUrl = 'https://my-todo-dope.herokuapp.com'

export interface TaskType {
  _id: string;
  status: 'pending'|'done'|'archived';
  name: string;
}
function App() {
  const [toDos, setToDos] = useState<TaskType[]>()
  const [newTask, setNewTask] = useState<string>()
  const [flashMsg, setFlashMsg] = useState<string>()
  const [msgStatus, setMsgStatus] = useState<'error'|'success'|'undefined'>()
  useEffect(() => {
    fetch(`${baseUrl}/task`)
    .then(res => res.json())
    .then(res => {
      
      setToDos(res.data)
    })
    .catch(error => {
      setFlashMsg(error.message)
      setMsgStatus('error')
    })
  }, [])
  return (
    <div className="App">
      <div className="main-container">
        <h2>Your todo task manager</h2>
        <div className={msgStatus === 'error' ? "is-error" : "is-success"}>
          {
            flashMsg && 
            <div className="message">
              <p>{flashMsg}</p>
              <button onClick={() => setFlashMsg('')}>X</button>
            </div>
          }
         
        </div>
        <div className="add-task">
        <input onChange={e => setNewTask(e.target.value)} type="text" name="newTask" id="newTask" />
        
        <button onClick={() => {
          if(newTask === undefined) alert('enter task')
          setFlashMsg('')
          fetch(`${baseUrl}/task`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: newTask})
          })
          .then(res => res.json())
          .then((res:{
            message: string; status:'error'|'success'; data: TaskType
          }) => {
            const newArr = toDos
            newArr?.unshift(res.data)
            setToDos(newArr)
            setFlashMsg(res.message)
            setMsgStatus(res.status)
          })
          .catch(error => alert(error.message))
        }}>+</button>
        </div>
        <div className="todo-wrp-main">
        <div className="todo-wrp">
        {
          toDos?.map(({name, status, _id}) => <div className="todo" key={_id}>
            <p>{name}</p>
            <button onClick={(e) => {
                setFlashMsg('') 
               fetch(`${baseUrl}/task/${_id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: newTask})
              })
              .then(res => res.json())
              .then(res => {
                setFlashMsg(res.message)
                setMsgStatus(res.status)
                if(res.status === 'success') {
                  const newToDos = toDos.filter(item => item._id !== _id)
                  setToDos(newToDos)
                }
              })
              .catch(error => alert(error.message))
            }}>X</button>
          </div>)
        }
        </div>
        <button className="clear" onClick={() => {
          setFlashMsg('')
          fetch(`${baseUrl}/task`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(res => res.json())
          .then(res => {
            setFlashMsg(res.message)
            setMsgStatus(res.status)
            setToDos([])
          })
          .catch(error => {
            alert(error.message)
          })
        }}>clear all</button>
        </div>
        
      </div>
    </div>
  );
}

export default App;
