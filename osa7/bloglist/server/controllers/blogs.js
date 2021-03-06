const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs.map((blog) => blog.toJSON()));
});

blogsRouter.post('/', async (request, response) => {
  const {
    body: { title, author, url, likes },
    token,
  } = request;

  const decodedToken = jwt.verify(token, process.env.SECRET);

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog.toJSON());
});

blogsRouter.delete('/:id', async (request, response) => {
  const {
    token,
    params: { id },
  } = request;

  const decodedToken = jwt.verify(token, process.env.SECRET);

  const blog = await Blog.findById(id);

  if (!decodedToken.id || decodedToken.id !== blog.user.toString()) {
    return response.status(401).json({ error: 'token missing or invalid' });
  }

  await Blog.findByIdAndRemove(id);

  const user = await User.findById(blog.user);
  user.blogs = user.blogs.filter((blog) => blog._id !== id);
  await user.save();

  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const modifiedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
    .populate('user')
    .exec();

  const user = await User.findById(modifiedBlog.user);
  user.blogs = user.blogs.map((blog) => (blog._id === modifiedBlog._id ? modifiedBlog : blog));
  await user.save();

  response.status(200).json(modifiedBlog.toJSON());
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const commentedBlog = await Blog.findById(request.params.id);

  commentedBlog.comments = commentedBlog.comments.concat(request.body.comment);
  await commentedBlog.save();

  const user = await User.findById(commentedBlog.user);
  user.blogs = user.blogs.map((blog) => (blog._id === commentedBlog._id ? commentedBlog : blog));
  await user.save();

  response.status(200).json(commentedBlog.toJSON());
});

module.exports = blogsRouter;
