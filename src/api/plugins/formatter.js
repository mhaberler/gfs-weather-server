export default function formatter (server) {
  server.formatters['application/json'] = function (req, res, body, cb) {
    if (body instanceof Error) {
      const err = body
      // snoop for RestError or HttpError, but don't rely on
      // instanceof
      res.statusCode = body.statusCode || 500

      if (body.body) {
        body = {
          msg: body.body.message
        }
      } else {
        body = {
          msg: body.message
        }
      }

      if (process.env.NODE_ENV === 'development') {
        body.stack = err.stack
      }
    } else if (Buffer.isBuffer(body)) {
      body = body.toString('base64')
    }

    let data = ''
    if (process.env.NODE_ENV === 'development') {
      data = JSON.stringify(body, null, 2)
    } else {
      data = JSON.stringify(body)
    }
    res.setHeader('Content-Length', Buffer.byteLength(data))

    cb(null, data)
  }
}
