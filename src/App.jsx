import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)
  const [createVisible, setCreateVisible] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      )
    }
  }, [user])

  const showNotification = (message, type) => {
    setNotification(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotification(null)
      setNotificationType(null)
    }, 5000)
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1
    }

    const returnedBlog = await blogService.update(
      blog.id,
      updatedBlog
    )

    setBlogs(
      blogs.map(blog =>
        blog.id === returnedBlog.id
          ? returnedBlog
          : blog
      )
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await loginService.login(
        username,
        password
      )

      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(loggedInUser)
      )

      setUser(loggedInUser)
      setUsername('')
      setPassword('')

      showNotification(
        `Welcome ${loggedInUser.name}!`,
        'success'
      )
    } catch (error) {
      showNotification(
        'Invalid username or password',
        'error'
      )
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)

    showNotification(
      'Successfully logged out',
      'success'
    )
  }

  const createBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(
        newBlog,
        user.token
      )

      setBlogs(blogs.concat(createdBlog))

      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success'
      )

      setCreateVisible(false)
    } catch (error) {
      showNotification(
        'Failed to create blog',
        'error'
      )
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification
          message={notification}
          type={notificationType}
        />

        <Login
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <Notification
        message={notification}
        type={notificationType}
      />

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      {createVisible ? (
        <BlogForm
          createBlog={createBlog}
          handleCancel={() => setCreateVisible(false)}
        />
      ) : (
        <button onClick={() => setCreateVisible(true)}>
          create new blog
        </button>
      )}

      <h2>blogs</h2>

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          handleLike={handleLike}
        />
      )}
    </div>
  )
}

export default App
