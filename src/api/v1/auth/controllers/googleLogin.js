const authService = require('../../../../service/auth');

const googleLogin = async (req, res, next) => {
  const { email } = req.user;
  try {
    const accessToken = await authService.googleLogin({ email });

    const response = {
      code: 200,
      message: 'Login successful',
      data: {
        access_token: accessToken,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = googleLogin;
