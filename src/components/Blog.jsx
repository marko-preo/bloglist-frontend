import { useState } from 'react'

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = {
    display: visible ? 'none' : ''
  }

  const showWhenVisible = {
    display: visible ? '' : 'none'
  }

  return (
    <div>
      <div>
        {blog.title} {blog.author}

        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      <div style={showWhenVisible}>
        <p>{blog.url}</p>
        <p>likes {blog.likes}</p>
      </div>
    </div>
  )
}

export default Blog