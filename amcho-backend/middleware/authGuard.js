import jwt from "jsonwebtoken";

export const protectRoute = (req, res, next) => {
  try {
    // Fetch the token in the cookie
    const token = req.cookies.auth_token;

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object
    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized or session expired" });
  }
};
