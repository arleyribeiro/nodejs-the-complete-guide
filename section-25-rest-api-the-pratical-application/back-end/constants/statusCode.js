const ok = 200;
const created = 201;
const accepted = 202;

const badRequest = 400;
const unauthorized = 401;
const forbidden = 403;
const notFound = 404;
const unprecessableEntity = 422;

const internalServerError = 500;

class StatusCode {
  static get OK() {
    return ok;
  }

  static get CREATED() {
    return created;
  }

  static get ACCEPTED() {
    return accepted;
  }

  static get BAD_REQUEST() {
    return badRequest;
  }

  static get UNAUTHORIZED() {
    return unauthorized;
  }

  static get FORBIDDEN() {
    return forbidden;
  }

  static get UNPRECESSABLE_ENTITY() {
    return unprecessableEntity;
  }

  static get INTERNAL_SERVER_ERROR() {
    return internalServerError;
  }

  static get NOT_FOUND() {
    return notFound;
  }
}

module.exports = StatusCode;