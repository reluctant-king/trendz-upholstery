const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Server Error';

  if (err.name === 'CastError') {
    status = 400;
    message = `Invalid ${err.path}`;
  }
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }
  if (err.code === 11000) {
    status = 400;
    message = `Duplicate value for ${Object.keys(err.keyValue || {}).join(', ')}`;
  }

  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
