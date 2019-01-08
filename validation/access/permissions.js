/**
 * Permissions function - only accepts one role at the time. If more checks are needed, then just add more permissions() after eachother
 * @role  Required role as String
 */
module.exports = role => {
  return (req, res, next) => {
    let errors = {};

    // This will probably only accept one role..
    if (req.user.roles.includes(role)) {
      next();
    } else {
      errors.access = "User has insufficient permissions";
      return res.status(401).json(errors);
    }
  };
};
