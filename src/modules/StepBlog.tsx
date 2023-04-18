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
      className={`flex flex-col justify-evenly items-center md:h-[680px] bg-black-primary text-white w-full py-10 gap-5 shadow-lg shadow-[#5f5f5377]`}
    >
      <h1 className="md:text-3xl text-xl font-bold">
        Lee lo que he estado{' '}
        <span className="text-[#f9ef2e]">escribiendo últimamente</span>
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center w-full md:gap-0 gap-5">
        {posts.map((post: ICardProps) => (
          <Card key={post.guid} {...post} />
        ))}
      </div>
    </section>
  )
}
