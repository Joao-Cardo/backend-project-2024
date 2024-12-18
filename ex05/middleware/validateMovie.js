import Joi from "joi";

const movieValidationSchema = Joi.object({
  title: Joi.string().min(1).required(),
  director: Joi.string().min(1).required(),
  year: Joi.number().min(1888).max(2100).required(),
});

const validateMovie = (req, res, next) => {
  const { error } = movieValidationSchema(req.body);
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message);
    return res.status(400).json({ error: errorMessage });
  }
  next();
};

export default validateMovie;
