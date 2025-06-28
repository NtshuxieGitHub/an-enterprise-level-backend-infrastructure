// Import necessary modules
import jwt from "jsonwebtoken";

// Middleware to check if the user is authenticated
function authMiddleware(req, res, next) {
  // Define a token variable
  const token = req.headers["authorization"];

  // Check if the token is provided
  if (!token) {
    return res.status(401).json({
      message: "No token provided.",
    });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, decoded) => {
    // Check if the token is valid
    if (error) {
      return res.status(401).json({
        message: "Invalid token.",
      });
    }

    // Set the user ID in the response
    req.userId = decoded.id;
    next(); // this module/function just allows the user to move on to the next endpoint
  });
}

export default authMiddleware;
