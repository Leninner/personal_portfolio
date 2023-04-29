import { NextApiRequest, NextApiResponse } from 'next'
import { HTTP_STATUS } from '../../constants/appEnums'
import { getBlogs } from '../../services/getBlogs'

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const articles = await getBlogs()

  res.status(HTTP_STATUS.SUCCESS).json(articles)
}

export default handler
