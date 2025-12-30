import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        notifications: [],
        unreadCount: 0,
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(n => !n.isRead).length;
        },
        addNotification: (state, action) => {
            if (!Array.isArray(state.notifications)) {
                state.notifications = [];
            }
            state.notifications.unshift(action.payload);

            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },
        markAllRead: (state) => {
            state.notifications.forEach(n => {
                n.isRead = true;
            });
            state.unreadCount = 0;
        },

    },
});
export const { setNotifications, addNotification, markAllRead } = rtnSlice.actions;
export default rtnSlice.reducer;