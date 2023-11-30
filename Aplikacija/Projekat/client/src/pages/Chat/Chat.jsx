import React, { useContext, useEffect, useState, useRef } from "react";
import "./Chat.css";
import axios from "axios";
import ChatBox from "../../components/ChatBox/ChatBox";
import { UserContext } from "../../UserContext";
import Conversation from "../../components/Conversation/Conversation";
import { io } from "socket.io-client";

const Chat = () => {
  const { username } = useContext(UserContext);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [recieveMessage, setRecieveMessage] = useState(null);
  const [dodato,setDodato] = useState(false);
  const [user, setUser] = useState(null);
  const socket = useRef();

  useEffect(() => {
    if (username && username._id !== null) {
      console.log(username._id);
      socket.current = io("http://localhost:3000");
      socket.current.emit("new-user-add", username._id);
      socket.current.on("get-users", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [username,dodato]);

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage,dodato]);

  useEffect(() => {
    socket.current?.on("receive-message", (data) => {
      setRecieveMessage(data);
    });
  }, [dodato]);

  useEffect(() => {
    const getChats = async () => {
      try {
        if (username) {
          const response = await axios.post("/userChats", {
            userId: username._id,
          });
          setChats(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [username,dodato]);

  const handleChatClick = (chat) => {
    setCurrentChat(chat);
  };
  async function handleButtonDodaj() {
    try {
      const stanariList = await axios.post("/createChat1", {
        id: username._id,
        username: user,
      });
      setUser(stanariList);
      setDodato(!dodato);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className=" my-auto flex flex-shrink items-center justify-center  bg-white max-w-[500px] rounded-md h-[310px] shadow"> 

      {/* Leva strana */}
      <div className="left-side-chat bg-green-400 h-[310px] max-w-[130px]  overflow-y-auto flex-grow">
          <input
            className="rounded-full p-1 mt-2 w-[100px]"
            value={user || ""}
            onChange={(ev) => setUser(ev.target.value)}
            placeholder="Username"
          ></input>
        <button
          className="bg-gray-200 px-4 rounded-2xl mb-4 justify-center"
          onClick={handleButtonDodaj}
        >
          Dodaj
        </button>
        <div className="Chat-Container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div className="w-[100px]" onClick={() => handleChatClick(chat)} key={chat._id}>
                  <Conversation data={chat} currentUserId={username._id} />
                </div>
              ))
            ) : (
              <p>No chats available</p>
            )}
          </div>
        </div>
      </div>
      {/* Desna strana */}
      <div className="right-side-chat bg-white max-h-[310px] max-w-[260px] overflow-y-auto flex-grow">
        {currentChat ? (
          <ChatBox
            chat={currentChat}
            currentUser={username._id}
            setSendMessage={setSendMessage}
            recieveMessage={recieveMessage}
          />
        ) : (
          <p>Select a chat to start the conversation</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
