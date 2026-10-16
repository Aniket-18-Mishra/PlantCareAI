/**
 * Global Express error handler.
 * Catches any errors that are passed to next(err) and returns a clean JSON response.
 * Never exposes stack traces to clients.
 */
const errorHandler = (err, req, res, _next) => {
  // Log the full error server-side for debugging
  console.error(`❌ [${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.error(err.stack || err.message);

  const statusCode = err.statusCode || err.status || 500;

  const message =
    process.env.NODE_ENV === 'development'
      ? err.message
      : 'Something went wrong. Please try again.';

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
