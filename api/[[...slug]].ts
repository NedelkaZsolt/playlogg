import serverless from 'serverless-http'
import app from '../server/app.ts'

const handler = serverless(app)

export default async function vercelHandler(req: any, res: any) {
  return handler(req, res)
}
