'use strict'

const _ = require('lodash')

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds)
}

// ['a', 'b'] --> {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefindedObject = obj => {
  Object.keys(obj).forEach(key => {
    if (obj[key] == null) {
      delete obj[key]
    }
  })
  return obj
}

// Đệ quy
const updateNestedObjectParser = obj => {
  const final = {}
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key])
      Object.keys(response).forEach(item => {
        final[`${key}.${item}`] = response[item]
      })
    } else {
      final[key] = obj[item]
    }
  })
  return final
}


module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefindedObject,
  updateNestedObjectParser
}