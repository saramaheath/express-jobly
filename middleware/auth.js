"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  console.log(res.locals.user, "res local user!!!!!!!!!!!!!!!!!!!!!!!!!");
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/**Middleware to check if current user is authorized Admin
 * if not raises error
 */
function ensureAdmin(req, res, next) {
  console.log(req);
  console.log(res.locals.user.isAdmin);
  try {
    const user = res.locals.user.isAdmin;
    if (!user || user.isAdmin) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

/**Middleware to check if current user is either authorized Admin
 * or if current user
 */
function ensureAdminOrCurrentUser(req, res, next) {
  if (!res.locals.user) throw new UnauthorizedError();
  console.log(res.locals.user);
  console.log(req, " request body**********");
  try {
    if (req.firstName === res.locals.user.firstName) {
      return next();
    } else if (res.locals.user.isAdmin === true) {
      return next();
    } else {
      throw new UnauthorizedError();
    }
  } catch (err) {
    console.log(err, "error");
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAdmin,
  ensureAdminOrCurrentUser,
};
