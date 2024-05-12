'use strict'

const { AccessService } = require("../services/access.service");
const { CREATED, SucessResponse } = require('../core/success.response')

class AccessController {

  // ------------------sign up-------------------
  signUp = async (req, res, next) => {
    new CREATED({
      message: "REGISTERED OK!",
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  }

  // ------------------login-------------------
  login = async (req, res, next) => {
    new SucessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  // ------------------logout-------------------
  logout = async (req, res, next) => {
    new SucessResponse({
      message: "Logout Success!",
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }
}

module.exports = new AccessController()