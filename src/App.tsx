import { EffectCallback, useEffect, useRef, useState } from 'react'
import './App.scss'
import { mockPosts } from './assets/mockPosts'
import { users } from './assets/users';

interface User {
  id: number;
  name: string;

  [key: string]: string | object | number;
}

interface Message {
  id: number;
  body: string;
  user: User;
  timestamp: number | Date;
  likes: number[];

  [key: string]: string | object | number;
}

const useMountEffect = (effect: EffectCallback) => useEffect(effect, []);

function App() {
  const [messages, setMessages] = useState(mockPosts as Message[]);
  const [currentUser, setCurrentUser] = useState(users[0] as User);
  const [selectedUser, setSelectedUser] = useState(null as User | null);
  const [selectedMessage, setSelectedMessage] = useState(null as Message | null);
  const [showMessageDetails, setShowMessageDetails] = useState(false);

  const myRef = useRef(null);

  function selectUser(id: string) {
    const currentUser = users.find(user => user.id === +id);
    currentUser && setCurrentUser(currentUser);
  }

  // scroll to last message
  const executeScroll = () => myRef.current.scrollIntoView();
  useMountEffect(executeScroll); // Scroll on mount

  function addMessage(event: any) {
    if (event.key === 'Enter') {
      event.target.value && setMessages([
        ...messages, {
          id: messages.length + 1,
          timestamp: new Date(),
          likes: [],
          body: event.target.value,
          user: currentUser
        }
      ]);
      executeScroll();
    }
  }

  function toggleLike(message: Message) {
    const userLiked = message.likes.indexOf(currentUser.id);
    userLiked === -1 ? message.likes.push(currentUser.id) : message.likes.splice(userLiked, 1);
    setSelectedMessage({ ...message });
  }

  return (

    <div className="App">
      <div className="chat">
        {messages.map(message => (
          <div className="message" key={message.id}>
            <div className="message-header">
              <span className="message-time">{new Date(message.timestamp).toLocaleString([], {
                year: "numeric",
                month: "numeric",
                day: "numeric", hour: "2-digit", minute: "2-digit"
              })}</span>
              <span className="message-author" onClick={() => setSelectedUser(message.user)}>{message.user.name}</span>
              <span className="message-like" onClick={() => toggleLike(message)}>Like</span>
              <span className="message-likes" onClick={() => {
                setSelectedMessage(message);
                setShowMessageDetails(true);
              }}>{message.likes.length}</span>
            </div>
            <div className="message-body">
              {message.body}
            </div>
          </div>
        ))}

        <div className="bottom-spacer" ref={myRef}/>
      </div>

      <div className="write-message">
        <select onChange={(event) => selectUser(event.target.value)}>
          {users.map(user => (
            <option id={user.name} key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>

        <input name="message" className="message-input" onKeyUp={addMessage}/>

      </div>

      {selectedUser && (
        <div className="popup">
          <div className="close" onClick={() => setSelectedUser(null)}>X</div>
          <h2>{selectedUser?.name}</h2>
          <p>{JSON.stringify(selectedUser)}</p>
        </div>)}

      {showMessageDetails && selectedMessage && (
        <div className="popup">
          <div className="close" onClick={() => setShowMessageDetails(false)}>X</div>
          <h2>Liked By:</h2>
          <ul>
            {selectedMessage.likes.map((userId, index) => {
              const likedUser = users.find(user => user.id === userId);
              return likedUser && (
                <li key={likedUser.id}>{likedUser.name}</li>
              )
            })}
          </ul>
        </div>)}

    </div>
  )
}

export default App;
