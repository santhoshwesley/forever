import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.json({
        success: false,
        message: "Not Authorized, Login Again",
      });
    }

    req.admin = token_decode;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Token is invalid or expired" });
  }
};

export default adminAuth;
