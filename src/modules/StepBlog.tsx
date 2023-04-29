import { useEffect, useState } from 'react'
import { Card, ICardProps } from '../components/BlogCard'

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
      className={`bg-black-primary text-white w-full flex flex-col gap-16 shadow-lg shadow-[#5f5f5377] py-20`}
    >
      <h1 className="md:text-3xl text-xl font-bold md:w-1/4">
        Lee lo que he estado{' '}
        <span className="text-[#f9ef2e]">escribiendo últimamente</span>
      </h1>

      <div className="w-full gap-5 flex flex-col">
        {posts.map((post: ICardProps) => (
          <Card key={post.guid} {...post} />
        ))}
      </div>
    </section>
  )
}
