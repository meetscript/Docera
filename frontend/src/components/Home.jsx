import React from 'react'
import Feed from './Feed'
import { Outlet } from 'react-router-dom'
import RightSidebar from './RightSidebar'
import useGetAllPost from '../hooks/useGetAllPost'
import useGetSuggestedUsers from '../hooks/useGetSuggestedUsers'
import useGetAllcities from '../hooks/useGetAllcities'
import useGetAllNotifications from '../hooks/useGetAllNotification'
const Home = () => {
    useGetAllNotifications();
    useGetAllPost();
    useGetAllcities();
    useGetSuggestedUsers();
    return (
        <div className='flex'>
            <div className='flex-grow'>
                <Feed />
                <Outlet />
            </div>
            <RightSidebar />
        </div>
    )
}

export default Home