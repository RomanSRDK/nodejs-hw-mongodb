import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof createHttpError.HttpError) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      errors: err.errors?.map((error) => error.message),
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
