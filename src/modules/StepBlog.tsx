import { useEffect, useState } from 'react'
import { Card, ICardProps } from '../components/Card'

export const StepBlog = () => {
  const [posts, setPosts] = useState<{
    [key: string]: any
  }>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await fetch(`/api/blogs`).then((res) => res.json())

      setPosts(data)
    }

    fetchPosts()
  }, [])

  return (
    <section
      className="flex flex-col justify-evenly items-center md:h-[680px] bg-[#1a1b1c] text-white md:px-[8.33vw] w-full py-10 gap-5 shadow-lg shadow-[#5f5f5377]"
      id="blog"
    >
      <h1 className="md:text-3xl text-xl font-bold">
        Mira mis <span className="text-[#f9ef2e]">últimos artículos</span>
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-0 gap-5">
        {posts.map((post: ICardProps) => (
          <Card key={post.guid} {...post} />
        ))}
      </div>
    </section>
  )
}
