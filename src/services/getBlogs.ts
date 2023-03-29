import Parser from 'rss-parser'

export const getBlogs = async () => {
  const START = 0
  const END = 3

  const parser = new Parser()
  try {
    const { items } = await parser.parseURL('https://medium.com/feed/@leninner')
    console.log(items)
    const lastArticles = items.slice(START, END)

    return lastArticles
  } catch (error) {
    return [
      {
        id: '1',
        title: 'Como hacer un blog con Next.js y Typescript',
        date: '2020-05-01T00:00:00.000Z',
        description:
          'Hoy hablamos de como hacer un blog con Next.js y Typescript',
        url: 'https://medium.com/@leninner',
      },
    ]
  }
}
