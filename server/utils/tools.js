exports.returnError = (code, message, res, next) => {
  const error = new Error(message);
  res.status(code);
  next(error);
};
