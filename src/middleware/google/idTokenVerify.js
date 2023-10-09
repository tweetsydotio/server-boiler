const config = require('../../config');

const IdToenVerify = async (req, res, next) => {
  try {
    const { query } = req;
    const { id_token } = query;
    if (!id_token) {
      return res.status(400).json({
        message: `Signup/Signin credentials invalid of Google account`,
        success: false,
      });
    }
    const decoded = jwt.decode(id_token);
    if (!decoded?.email_verified) {
      return res.status(403).json({
        message: `Google account is not verified`,
        success: false,
      });
    }
    req.user = decoded;
    return next();
  } catch (e) {
    next(e);
  }
};

module.exports = { IdToenVerify };
