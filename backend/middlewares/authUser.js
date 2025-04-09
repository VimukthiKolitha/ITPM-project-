import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({ success: false, message: 'Not authorized, login again' });
    }

    const token_decord = jwt.verify(token, process.env.JWT_SECREAT);

    // Assign userId to req object
    req.userId = token_decord.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;