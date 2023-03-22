import Parser from 'rss-parser'

export const getBlogs = async () => {
  const parser = new Parser()
  const { items } = await parser.parseURL('https://medium.com/feed/@leninner')
  const [{ title, link }] = items

  return { title, link }
}
