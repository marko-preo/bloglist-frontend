import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [user, setUser] = useState(null)

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
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title,
      author,
      url
    }

    try {
      const createdBlog = await blogService.create(
        newBlog,
        user.token
      )

      setBlogs(blogs.concat(createdBlog))

      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.log(error)
    }
  }

  if (user === null) {
    return (
      <Login
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    )
  }

  return (
    <div>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <BlogForm
        title={title}
        author={author}
        url={url}
        handleTitleChange={({ target }) => setTitle(target.value)}
        handleAuthorChange={({ target }) => setAuthor(target.value)}
        handleUrlChange={({ target }) => setUrl(target.value)}
        handleSubmit={handleCreateBlog}
      />

      <h2>blogs</h2>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App