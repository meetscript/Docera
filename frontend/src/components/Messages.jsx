import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "../hooks/useGetAllMessage";
import useGetRTM from "../hooks/useGetRTM";
import { User, ExternalLink } from "lucide-react";
import { cn } from "../lib/utils";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="overflow-y-auto flex-1 p-4 bg-base-100">
      {/* Chat header / intro */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-col items-center">
          <div className="avatar">
            <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {selectedUser?.profilePicture ? (
                <img
                  src={selectedUser.profilePicture}
                  alt="profile"
                  className="object-cover"
                />
              ) : (
                <div className="bg-neutral-focus text-neutral-content w-full h-full rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
          </div>

          <span className="mt-2 text-lg font-semibold">
            {selectedUser?.username}
          </span>

          <Link to={`/profile/${selectedUser?._id}`}>
            <button className="btn btn-outline btn-sm mt-2 gap-2">
              View profile
              <ExternalLink className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4">
        {messages &&
          messages.map((msg) => {
            const isSender = msg.senderId === user?._id;

            return (
              <div
                key={msg._id}
                className={cn(
                  "flex",
                  isSender ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 max-w-[75%] lg:max-w-md break-words",
                    isSender
                      ? "bg-primary text-primary-content"
                      : "bg-secondary text-secondary-content"
                  )}
                >
                  {/* Image message */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="sent"
                      className="mb-2 rounded-lg max-h-64 w-full object-cover cursor-pointer"
                      onClick={() => window.open(msg.image, "_blank")}
                    />
                  )}

                  {/* Text message */}
                  {msg.message && (
                    <p className="text-sm leading-relaxed">
                      {msg.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
