'use strict'

const { NotifyType } = require("../contants")
const { BadRequestError } = require("./error.response")
const notificationModel = require("../models/notification.model")

class NotificationService {
  static notifyTypeRegistry = {}

  static registerNotifyType(type, classRef) {
    NotificationService.notifyTypeRegistry[type] = classRef
  }

  static getContent(type, payload) {
    const notifyClassFactory = NotificationService.notifyTypeRegistry[type]
    if (!notifyClassFactory) throw new BadRequestError('Error')

  }

  // ----------------- push notification------------------
  static async pushNotiToSystem({
    type = NotifyType.SHOP_001,
    senderId = 1,
    receivedId = 1,
    options = {}
  }) {
    let noti_content = await NotificationService.getContent(type, options)
    if (type = NotifyType.SHOP_001) {
      noti_content = `SHOP XXX vừa thêm một sản phẩm: AAAA`
    } else if (type = 'PROMOTION-001') {
      noti_content = `SHOP XXX vừa thêm một voucher: BBBB`
    }

    const newNoti = await notificationModel.create({
      noti_type: type,
      noti_senderId: senderId,
      noti_receivedId: receivedId,
      noti_content: noti_content,
      noti_options: options
    })

    return newNoti
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
          noti_content: {
            $concat: [
              "$noti_options.shop_name",
              " vừa mới thêm một sản phẩm mới: ",
              "$noti_options.product_name"
            ]
          }
        }
      }
    ]
    )
  }
}


module.exports = NotificationService