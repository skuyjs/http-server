import { Req } from '../../typings/req'
/**
 * Parse JSON
 * @param req
 */
const json = (req: Req) => {
  try {
    return JSON.parse(req.body as string)
  } catch (e) {
    return {}
  }
}
export default json
