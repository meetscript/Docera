import React, { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {X} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import api from '../lib/axios'
import { toast } from 'react-hot-toast'
import { setPosts } from '../redux/postSlice'
import { useNavigate } from 'react-router-dom'
const CommentDialog = () => {
  const navigate =useNavigate();
  const {id}=useParams();
  const [text, setText] = useState("");
  const [comment, setComment] = useState([]);
  const {posts}= useSelector((store)=>store.post);
  const post = posts.find((p) => p._id === id);

  const dispatch = useDispatch();

  useEffect(() => {
    if (post) {
      setComment(post.comments);
    }
  }, [post]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const sendMessageHandler = async () => {
    try {
      const res = await api.post(`post/${selectedPost?._id}/comment`, { text }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-content/60">
  <div className="relative bg-base-100 rounded-lg shadow-xl w-[90vw] max-w-5xl h-[80vh] flex overflow-hidden">

    <div className="w-1/2 h-full">
      <img
        src={post?.image}
        alt="post"
        className="w-full h-full object-cover rounded-l-lg"
      />
    </div>

    {/* RIGHT SIDE: Comments */}
    <div className="w-1/2 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <div className="flex items-center gap-3">
          <Link>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-base-300">
              <img
                src={post?.author?.profilePicture}
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <div>
            <Link className="font-semibold text-sm hover:underline text-base-content" to={`/profile/${post?.author?._id}`}>
              {post?.author?.username || "Unknown User"}
            </Link>
          </div>
        </div>

       
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {comment.length > 0 ? (
          comment.map((c) => <Comment key={c._id} comment={c} />)
        ) : (
          <p className="text-sm text-base-content/60 text-center mt-4">
            No comments yet.
          </p>
        )}
      </div>

      {/* Add Comment */}
      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={changeEventHandler}
            placeholder="Add a comment..."
            className="input input-bordered input-sm w-full"
          />
          <button
            disabled={!text.trim()}
            onClick={sendMessageHandler}
            className={`btn btn-sm ${text.trim() ? 'btn-primary' : 'btn-disabled'}`}
          >
            Send
          </button>
        </div>
      </div>
    </div>

    {/* Close Button */}
    <button
      onClick={() => {navigate(-1)}}
      className="absolute top-3 right-4 cursor-pointer hover:text-base-400 text-2xl"
    >
      <X />
    </button>
  </div>
</div>

  );
};

export default CommentDialog;
