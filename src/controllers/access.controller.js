'use strict'

const { AccessService } = require("../services/access.service");
const { CREATED, SucessResponse } = require('../core/success.response')

class AccessController {

  signUp = async (req, res, next) => {
    new CREATED({
      message: "REGISTERED OK!",
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  }

  login = async (req, res, next) => {
    new SucessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }
}

module.exports = new AccessController()