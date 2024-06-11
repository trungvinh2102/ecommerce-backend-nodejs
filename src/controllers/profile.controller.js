
const { SucessResponse } = require('../core/success.response')

const dataProfile = [
  {
    usr_id: 1,
    usr_name: "Trung Vinh 1",
    usr_avatar: "image/1"
  },
  {
    usr_id: 2,
    usr_name: "Trung Vinh 2",
    usr_avatar: "image/2"
  },
  {
    usr_id: 3,
    usr_name: "Trung Vinh 3",
    usr_avatar: "image/3"
  }

]


class ProfileController {
  // --------------------admin------------------------
  profiles = async (req, res, next) => {
    new SucessResponse({
      message: 'views all profiles',
      metadata: dataProfile
    }).send(res)
  }

  // -----------------------shop------------------------
  profile = async (req, res, next) => {
    new SucessResponse({
      message: 'views one profile',
      metadata: dataProfile
    }).send(res)
  }
}

module.exports = new ProfileController()