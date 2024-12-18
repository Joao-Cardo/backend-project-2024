import jwt from "jsonwebtoken";

const authenticate = (roles = []) => {
  return (req, res, next) => {
    // Extract the authorization header
    const authHeader = req.headers?.authorization;

    // Check fi the Authorization header is present
    if (!authHeader || !authHeader. startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    try {
      //Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //Attach the decoded token to the request object for later use
      req.user = decoded; // decoded contains data like {id, role}
      if (roles.length && !roles.includes(decoded.role)) {
        //Client doesn't have any of the roles given in paramters
        return res
          .status(403)
          .json({ error: "Forbidden: insufficient permissions." });
      }
      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired token." });
    }
  };
};

export default authenticate;
