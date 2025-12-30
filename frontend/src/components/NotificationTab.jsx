import { useDispatch, useSelector } from "react-redux";
import { markAllRead } from "../redux/rtnSlice";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../lib/axios"; 

const NotificationTab = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications } = useSelector(
    store => store.realTimeNotification
  );

  const handleBack = async () => {
    try {
      // 1️⃣ Update DB
      await api.put("user/read-all/notifications");

      // 2️⃣ Update Redux
      dispatch(markAllRead());

      // 3️⃣ Navigate back
      navigate(-1);
    } catch (err) {
      console.error("Failed to mark notifications read", err);
      navigate(-1); // still allow navigation
    }
  };

  if (!notifications || notifications.length === 0) {
    return (
      <div className="p-6 text-center text-base-content/60">
        No notifications yet
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-base-100 rounded-xl shadow-md">
      
      {/* Header */}
  {/* Header */}
<div className="relative border-b border-base-300 px-4 py-3">
  
  {/* Back Arrow – top left */}
  <button
    onClick={handleBack}
    className="
      absolute left-3 top-1/2 
      -translate-y-1/2
      p-1 
      rounded-full 
      hover:bg-base-200 
      transition
    "
  >
    <ArrowLeft size={20} />
  </button>

  {/* Title centered */}
  <div className="text-center font-semibold">
    Notifications
  </div>
</div>


      {/* List */}
      <ul className="divide-y divide-base-200">
        {notifications.map(notification => (
          <li
            key={notification._id}
            onClick={() => {
              if (notification.postId) {
                navigate(`/post/${notification.postId}`);
              }
            }}
            className="
              flex items-start gap-3 
              px-4 py-3 
              cursor-pointer 
              hover:bg-base-200 
              transition
            "
          >
            {/* Blue dot */}
            <div className="mt-1">
              {notification.isRead === false && (
                <span className="w-2 h-2 rounded-full bg-primary block" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1">
              <p className="text-sm text-base-content">
                {notification.message}
              </p>
              <span className="text-xs text-base-content/50">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationTab;
