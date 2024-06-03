'use strict'

const { uploadImageFromUrl, uploadImageFromLocal } = require("../services/upload.service");
const { SucessResponse } = require('../core/success.response');
const { BadRequestError } = require("../core/error.response");

class UploadController {

  //--------------------------------------------
  uploadFile = async (req, res, next) => {
    new SucessResponse({
      message: 'Upload file successfully',
      metadata: await uploadImageFromUrl()
    }).send(res)
  }

  //
  uploadLocalFileThumb = async (req, res, next) => {
    const { file } = req
    if (!file) throw new BadRequestError('File missing!')
    new SucessResponse({
      message: 'Upload file successfully',
      metadata: await uploadImageFromLocal({
        path: file.path
      })
    }).send(res)
  }
}

module.exports = new UploadController()

