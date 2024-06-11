

const { AuthFailureError } = require('../core/error.response');
const { roleList } = require('../services/rbac.service');
const rbac = require('./role.middleware')

const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(await roleList({ userId: 9999 }))
      const role_name = req.query.role;
      const permission = rbac.can(role_name)[action](resource)
      if (!permission.granted) throw new AuthFailureError('you do not have enough permission...')
      next()
    } catch (error) {
      next(error)
    }
  }
}
module.exports = {
  grantAccess
}