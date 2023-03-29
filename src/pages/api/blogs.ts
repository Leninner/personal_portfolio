import { HTTP_STATUS } from '../../constants/appEnums'
import { getBlogs } from '../../services/getBlogs'

const handler = async (_: unknown, res: any) => {
  const articles = await getBlogs()

  res.status(HTTP_STATUS.SUCCESS).json(articles)
}

export default handler
