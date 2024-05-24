'use strict'

const NotificationService = require("../services/notification.service");
const { SucessResponse } = require('../core/success.response')

class NotificationController {

  //--------------------create comment------------------------
  getAllNotiByUser = async (req, res, next) => {
    new SucessResponse({
      message: 'getAllNotiByUser success!',
      metadata: await NotificationService.getAllNotiByUser(req.query)
    }).send(res)
  }
}


module.exports = new NotificationController()