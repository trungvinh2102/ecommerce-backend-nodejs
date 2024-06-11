'use strict'

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: 'x-refreshtoken-id'
}

const ROLESHOP = {
  ADMIN: '1',
  SHOP: '2',
  USER: '3'
}

const NotifyType = {
  SHOP_001: "SHOP-001",
  ORDER_001: 'ORDER-001',
  ORDER_001: 'ORDER-002',
  PROMOTION: 'PROMOTION-001'
}

module.exports = {
  HEADER,
  ROLESHOP,
  NotifyType
}