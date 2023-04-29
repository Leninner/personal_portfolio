export interface IProject {
  id: number
  name: string
  description: string
  image: string
  stack?: string[]
  livePreview?: string
  sourceCode?: string
}

export const getProjects = async () => {
  try {
    const data = await fetch(
      'https://oikir24txi.execute-api.us-east-1.amazonaws.com/Prod/projects'
    )
    const parsedData = await data.json()

    return parsedData
  } catch (error) {
    return [
      {
        guid: '1',
        title: 'Como hacer un blog con Next.js y Typescript',
        date: '2020-05-01T00:00:00.000Z',
        link: 'https://medium.com/@leninner',
      },
    ]
  }
}
