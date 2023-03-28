import { useEffect, useState } from 'react'
import { Card, ICardProps } from '../components/Card'
import { getBlogs } from '../services/getBlogs'

export const StepBlog = () => {
  const [posts, setPosts] = useState<{
    [key: string]: any
  }>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getBlogs()
      setPosts(data)
    }

    fetchPosts()
  }, [])

  console.log(posts)

  return (
    <section
      className="flex flex-col justify-evenly items-center md:h-[680px] bg-[#1a1b1c] text-white md:px-[8.33vw] w-full py-10 gap-5"
      id="blog"
    >
      <h1 className="md:text-3xl text-xl">
        Mira mis{' '}
        <span className="text-[#f9ef2e] font-bold">últimos artículos</span>
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-0 gap-5">
        {posts.map((post: ICardProps) => (
          <Card key={post.id} {...post} />
        ))}
      </div>
    </section>
  )
}
