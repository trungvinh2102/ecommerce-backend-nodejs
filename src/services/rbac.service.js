const { BadRequestError } = require("../core/error.response")
const resourceModel = require("../models/resource.model")
const roleModel = require("../models/role.model")

const createResource = async ({
  name = 'profile',
  slug = 'p0001',
  description = ''
}) => {
  try {

    const resource = await resourceModel.create({
      src_name: name,
      src_slug: slug,
      src_description: description
    })

    if (!resource) throw new BadRequestError(`Resource doen't exists!`)
    return resource
  } catch (error) {
    return error
  }
}

const resourceList = async ({
  userId,
  limit = 30,
  offset = 0,
  search = ''
}) => {
  try {

    const resources = await resourceModel.aggregate([
      {
        $project: {
          _id: 0,
          name: '$src_name',
          slug: '$src_slug',
          description: '$src_description',
          resourceId: '$_id',
          createdAt: 1
        }
      }
    ])
    return resources
  } catch (error) {
    return error
  }
}

const createRole = async ({
  name = 'shop',
  slug = 's0001',
  description = 'extend from shop or user',
  grants = []
}) => {
  try {
    const role = await roleModel.create({
      rol_name: name,
      rol_slug: slug,
      rol_description: description,
      rol_grants: grants
    })

    if (!role) throw new BadRequestError(`Role doen't exists!`)
    return role
  } catch (error) {
    return error
  }
}

const roleList = async ({
  userId
}) => {
  try {

    const roles = await roleModel.aggregate([
      {
        $unwind: '$rol_grants'
      },
      {
        $lookup: {
          from: 'resources',
          localField: 'rol_grants.resource_id',
          foreignField: '_id',
          as: 'resource'
        }
      },
      {
        $unwind: '$resource'
      },
      {
        $project: {
          role: '$rol_name',
          resource: '$resource.src_name',
          actions: '$rol_grants.actions',
          attributes: '$rol_grants.attributes'
        }
      },
      {
        $unwind: '$actions'
      },
      {
        $project: {
          _id: 0,
          role: 1,
          resource: 1,
          action: "$actions",
          attributes: 1
        }
      }
    ])

    return roles
  } catch (error) {
    return error
  }
}

module.exports = {
  createResource,
  resourceList,
  createRole,
  roleList
}