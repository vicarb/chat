import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import * as SocketIOClient from 'socket.io-client';

interface Message {
  text: string;
  sender: string;
}

export const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const newSocket = io("http://localhost:4000");
  
    if (newSocket) {
      setSocket(newSocket);
    }
  
    return ():void => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);
  
  

  useEffect(() => {
    if (!socket) return;
  
    const handleMessage = (message: any) => {
      console.log(message):
      setMessages((prevMessages) => [...prevMessages, message]);
    };
  
    socket.on("message", handleMessage);
  
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  
    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket, messages]);
  
  

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (input !== "") {
      const message = { sender: username, text: input };
      socket?.emit("message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-200 p-4 rounded-md">
      {username === "" ? (
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="font-bold">
            Enter your username:
          </label>
          <input
            type="text"
            id="username"
            className="bg-emerald-500 border border-gray-400 rounded-md p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white font-bold rounded-md p-2"
            onClick={() => setUsername(input)}
          >
            Enter
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-grow max-h-80 overflow-y-auto">
          <h1 className="text-lg font-bold mb-2">Welcome to the chat!</h1>
          <div className="flex flex-col">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  message.sender === username ? "items-end" : ""
                }`}
              >
                <span className="font-bold text-emerald-500">
                  {message.sender}
                </span>
                <span className="text-black p-2 rounded-md shadow max-w-md overflow-hidden overflow-ellipsis break-words">
                  {message.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
      <div className="mt-4 flex">
        <input
          type="text"
          className="bg-emerald-500 border border-gray-400 rounded-md p-2 flex-grow"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white font-bold rounded-md p-2 ml-2"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

