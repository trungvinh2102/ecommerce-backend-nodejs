'use strict'

const { uploadImageFromUrl, uploadImageFromLocalS3, uploadImageFromLocalCloudinary } = require("../services/upload.service");
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
      metadata: await uploadImageFromLocalCloudinary({
        path: file.path
      })
    }).send(res)
  }

  //
  uploadFileFormLocalS3 = async (req, res, next) => {
    const { file } = req
    if (!file) throw new BadRequestError('File missing!')
    new SucessResponse({
      message: 'Upload file successfully',
      metadata: await uploadImageFromLocalS3({
        file
      })
    }).send(res)
  }
}

module.exports = new UploadController()

