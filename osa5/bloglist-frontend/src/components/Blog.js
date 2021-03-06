import React, { useState } from 'react';

const Blog = ({ blog, like, remove, user: currentUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const { title, author, url, likes, user = { username: 'random' } } = blog;

  const [displayFull, setDisplayFull] = useState(false);

  const toggleView = () => setDisplayFull(!displayFull);

  const likeBlog = () => {
    const updatedBlog = { ...blog, likes: (blog.likes += 1) };
    like(updatedBlog);
  };

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${title} by ${author}?`)) {
      remove(blog);
    }
  };

  const displayButton = <button onClick={toggleView} className='blog-view-button'>{displayFull ? 'hide' : 'view'}</button>;

  const likeButton = <button onClick={likeBlog} className='blog-like-button'>like</button>;

  const removeButton = (
    <button style={{ background: '#34c0eb' }} onClick={removeBlog} className='blog-remove-button'>
      remove
    </button>
  );

  return (
    <div style={blogStyle}>
      <div>
        {title} {author} {displayButton}
      </div>
      {displayFull && (
        <div>
          <p>{url}</p>
          <p className='likes'>
            {likes} {likeButton}
          </p>
          <p>{user && user.username}</p>
          {currentUser.username === user.username && removeButton}
        </div>
      )}
    </div>
  );
};

export default Blog;
