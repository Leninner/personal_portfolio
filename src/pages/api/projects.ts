import { NextApiRequest, NextApiResponse } from 'next'
import { HTTP_STATUS } from '../../constants/appEnums'
import { getProjects } from '../../services/getProjects'

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  const articles = await getProjects()

  res.status(HTTP_STATUS.SUCCESS).json(articles)
}

export default handler
