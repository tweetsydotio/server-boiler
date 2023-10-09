const authService = require('../../../../service/auth');

const googleLogin = async (req, res, next) => {
  const { email, name, picture: profilePic } = req.user;
  try {
    const accessToken = await authService.googleRegister({
      email,
      name,
      profilePic,
    });

    const response = {
      code: 201,
      message: 'Register successful',
      data: {
        access_token: accessToken,
      },
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = googleLogin;
