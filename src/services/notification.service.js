'use strict'

const { NotifyType } = require("../contants")
const { BadRequestError } = require("../core/error.response")
const notificationModel = require("../models/notification.model")

class NotificationService {
  static notifyTypeRegistry = {}

  static registerNotifyType(type, classRef) {
    NotificationService.notifyTypeRegistry[type] = classRef
  }

  static getContent(type, payload) {
    const notifyClassFactory = NotificationService.notifyTypeRegistry[type]
    if (!notifyClassFactory) throw new BadRequestError('Bad request');

    return notifyClassFactory(payload).buidContent()
  }

  // ----------------- push notification------------------
  static async pushNotiToSystem({
    type = NotifyType.SHOP_001,
    senderId = 1,
    receivedId = 1,
    options = {}
  }) {
    let notifyContent = await NotificationService.getContent()

    return await notificationModel.create({
      noti_type: type,
      noti_content: notifyContent,
      noti_senderId: senderId,
      noti_receivedId: receivedId,
      noti_options: options
    })
  }

  // --------------------get all noti by user-----------------
  static async getAllNotiByUser({
    userId = 1,
    type = "ALL",
    isRead = 0
  }) {
    const match = { noti_receivedId: userId }
    if (type !== "ALL") {
      match['noti_type'] = type
    }

    return await notificationModel.aggregate([
      { $match: match },
      {
        $project: {
          noti_type: 1,
          noti_receivedId: 1,
          noti_senderId: 1,
          noti_options: 1,
          createAt: 1,
          noti_content: 1
        }
      }
    ]
    )
  }
}


module.exports = NotificationService