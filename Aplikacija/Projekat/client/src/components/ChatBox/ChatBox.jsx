import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ chat, currentUser, setSendMessage, recieveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  useEffect(() => {
    if (recieveMessage && recieveMessage.chatId === chat._id) {
      setMessages((prevMessages) => [...prevMessages, recieveMessage]);
    }
  }, [recieveMessage, chat._id]);

  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const response = await axios.post("/getUser", { id: userId });
        setUserData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat) {
      getUserData();
    }
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post("/preuzmiPoruke", {
          chatId: chat?._id,
        });
        console.log(response);
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat) {
      fetchMessages();
    }
  }, [chat, chat?._id]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      return;
    }
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat?._id,
    };
    try {
      const { data } = await axios.post("/dodajPoruku", message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });
  };

  return (
    <div className=" min-w-[200px]">
      {chat ? (
        <div className="chat-header">
          <div className="nesto">
            <div>
              <div className="online-dot"></div>
              <div className="name" style={{ fontSize: "0.8rem" }}>
                <div className="flex justify-end shadow bg-gray-100">
                <a href={`http://localhost:5173/profile/${userData?.username}`}>
                <div className="flex justify-center border-4 border-green-400 rounded-l-full  items-center font-bold ">
                <img className=" w-7 h-7 rounded-full object-cover " src={`http://localhost:3500/uploads/${userData?.slika}`} alt="" />
                  <div>{userData?.ime}</div>&nbsp;<div className="mr-1">{userData?.prezime}</div> 
                </div>
                </a>
                </div>
              </div>
            </div>
          </div>
          <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
        </div>
      ) : (
        <span>Pritisni neki chat</span>
      )}
      <div className="chat-body flex flex-col gap-3 overflow-y-auto max-h-[220px] max-w-[1000px]">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              className={
                message.senderId === currentUser
                  ? "message-sender flex justify-end max-w-[300px]"
                  : "message-receiver flex justify-start max-w-[300px]"
              }
              key={message._id}
            >
              <div
                className={
                  message.senderId === currentUser
                    ? "message-sender-content bg-green-200 border-2 border-green-500 rounded p-2"
                    : "message-receiver-content bg-gray-200 border-2 border-gray-300 rounded p-2"
                }
              >
                <span style={{ wordBreak: "break-word" }}>{message.text}</span>
                <span className="text-xs text-gray-500 block mt-1">
                  {format(message.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No chats available</p>
        )}
      </div>
      <div className="flex items-center justify-center shadow-2xl">
        <button
          className="send-button button bg-white px-4 h-[35px] rounded-2xl  justify-center border-2 border-green-500 flex items-center"
          onClick={handleSend}
          
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="green" className="w-6 h-6" transform="matrix(-1, 0, 0, 1, 0, 0)">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>

        </button>
        <div className="min-w-[150px]">
        <InputEmoji
          value={newMessage}
          onChange={handleChange}
          className="max-w-[30px] overflow-y-auto break-all max-h-[10px]"
          placeholder="Upiši poruku"
        />
        </div>
      </div>
      {!chat && (
        <span className="chatbox-empty-message">
          Tapni na Chat da započneš razgovor
        </span>
      )}
    </div>
  );
};

export default ChatBox;
