'use strict'

const notificationModel = require("../models/notification.model")

class NotificationService {

  // ----------------- push notification------------------
  static async pushNotiToSystem({
    type = 'SHOP-001',
    senderId = 1,
    receivedId = 1,
    options = {}
  }) {
    let noti_content
    if (type = 'SHOP-001') {
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

  // -----------------------------------------------
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
          noti_content: 1,
          noti_receivedId: 1,
          noti_senderId: 1,
          noti_options: 1,
          createAt: 1
        }
      }
    ]
    )
  }
}


module.exports = NotificationService