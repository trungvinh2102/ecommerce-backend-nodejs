'use strict'

const {
  resourceList,
  createResource,
  createRole,
  roleList
} = require("../services/rbac.service");
const { CREATED, SucessResponse } = require('../core/success.response')

class RbacController {

  // ------------------create new role-------------------
  newRole = async (req, res, next) => {
    new SucessResponse({
      message: "create new role successfully!",
      metadata: await createRole(req.body)
    }).send(res)
  }
  // ------------------create new role-------------------
  newResource = async (req, res, next) => {
    new SucessResponse({
      message: "create new resource successfully!",
      metadata: await createResource(req.body)
    }).send(res)
  }

  // ------------------create new role-------------------
  listRoles = async (req, res, next) => {
    new SucessResponse({
      message: "get list role success!",
      metadata: await roleList(req.query)
    }).send(res)
  }

  // ------------------create new role-------------------
  listResources = async (req, res, next) => {
    new SucessResponse({
      message: "get list resource success!",
      metadata: await resourceList(req.query)
    }).send(res)
  }


}

module.exports = new RbacController()