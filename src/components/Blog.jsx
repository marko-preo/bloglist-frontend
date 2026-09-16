import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <div>
        {blog.title} {blog.author}

        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      <div style={{ display: visible ? '' : 'none' }}>
        <p>{blog.url}</p>

        <p>
          likes {blog.likes}

          <button onClick={() => handleLike(blog)}>
            like
          </button>
        </p>

        <p> added by {blog.user.name} </p>
      </div>
    </div>
  )
}

export default Blog