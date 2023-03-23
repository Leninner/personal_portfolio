import { useState } from 'react'

interface IPost {
  id: number
}

export const Card = () => {
  const [posts, setPosts] = useState<IPost[]>([])

  return (
    <div className="h-60 md:h-60 w-5/6 md:w-[30%] bg-red-50 outline-dashed">
      <h1>Leninsin el amigos</h1>
    </div>
  )
}
