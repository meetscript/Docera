import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/authSlice";
import { setMessages } from "../redux/chatSlice";
import { Camera, MessageCircleCode, User, X } from "lucide-react";
import Messages from "./Messages";
import api from "../lib/axios";
import usegetmsgusers from "../hooks/usegetmsgusers";

const ChatPage = () => {
  usegetmsgusers();

  const dispatch = useDispatch();
  const imageRef = useRef(null);
  const [loader,setLoader]= useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [image, setImage] = useState(null);

  const { user, selectedUser, msgusers } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const sendMessageHandler = async (receiverId) => {
    setLoader(true);
    try {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("textMessage", textMessage);

        const resImage = await api.post(
          `message/send/image/${receiverId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        if (resImage.data.success) {
          dispatch(setMessages([...messages, resImage.data.newMessage]));
          setTextMessage("");
          setImage(null);
          imageRef.current.value = "";
        }
      } else {
        const res = await api.post(
          `message/send/${receiverId}`,
          { textMessage },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setMessages([...messages, res.data.newMessage]));
          setTextMessage("");
        }
      }
    } catch (error) {
      console.log(error);
    }
    finally{
        setLoader(false);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, [dispatch]);

  return (
    <div className="flex ml-[16%] h-screen">
      {/* Sidebar */}
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />

        <div className="overflow-y-auto h-[80vh]">
          {Array.isArray(msgusers) && msgusers.length > 0 ? (
            msgusers.map((msguser) => {
              const isOnline = onlineUsers.includes(msguser?._id);

              return (
                <div
                  key={msguser._id}
                  onClick={() => dispatch(setSelectedUser(msguser))}
                  className="flex gap-3 items-center p-3 hover:bg-base-200 cursor-pointer rounded-lg"
                >
                  <div className="avatar">
                    <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center bg-base-200 overflow-hidden">
                      {msguser?.profilePicture ? (
                        <img
                          src={msguser.profilePicture}
                          alt="profile"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-medium">{msguser?.username}</span>
                    <span
                      className={`text-xs font-semibold ${
                        isOnline ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isOnline ? "online" : "offline"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-500 mt-4">
              No users available
            </p>
          )}
        </div>
      </section>

      {/* Chat Area */}
      {selectedUser ? (
        <section className="flex-1 border-l border-gray-300 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300 bg-base-100">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center bg-base-200 overflow-hidden">
                {selectedUser?.profilePicture ? (
                  <img
                    src={selectedUser.profilePicture}
                    alt="profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>

            <span className="font-semibold text-lg">
              {selectedUser?.username}
            </span>
          </div>

          {/* Messages */}
          <Messages selectedUser={selectedUser} />

          {/* Input Area */}
          <div className="border-t border-gray-300 p-4 bg-base-100 flex flex-col">
            {image && (
              <div className="relative w-40 mb-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-lg border"
                />

                <button
                  onClick={() => {
                    setImage(null);
                    imageRef.current.value = "";
                  }}
                  className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="text"
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                placeholder="Type a message..."
                className="input input-bordered w-full mr-2"
              />

              <button
                onClick={() => imageRef.current.click()}
                className="btn btn-ghost mr-2"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                onChange={fileChangeHandler}
                className="hidden"
              />

              <button
                onClick={() => sendMessageHandler(selectedUser?._id)}
                className="btn btn-primary"
                disabled={(!textMessage.trim() && !image)||loader}
              >
                Send
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 text-primary my-4" />
          <h1 className="font-medium text-lg">Your messages</h1>
          <span className="text-sm text-gray-500">
            Send a message to start a chat.
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
