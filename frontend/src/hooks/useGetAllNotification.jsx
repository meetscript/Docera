import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setNotifications } from "../redux/rtnSlice";
import api from "../lib/axios";

const useGetAllNotifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications from API...");
      const res = await api.get('user/notifications', { withCredentials: true });
        console.log("Response from notifications API:");
        if (res.data.success) {
          dispatch(setNotifications(res.data.notifications));
          console.log("Fetched notifications:", res.data.notifications);
        }
      } catch (error) {
        console.log("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [dispatch]);
};

export default useGetAllNotifications;
