

const admMiddleware = (req, res, next) => {
  req.privileges_id === 1 
  ? next() 
  : res.status(401).json({
    error: {
      noAdmin: `No tiene permisos para realizar la acción solicitada`,
    },
  })
}

module.exports = admMiddleware;