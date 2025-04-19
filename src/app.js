const cors = require('cors');
const express = require('express');
const swaggerUI = require('swagger-ui-express');

const { errorHandler } = require('./middlewares/error_handling');
const { ApiError } = require('./utils/responses');
const v1Routes = require('./routes/v1');
const openapiSpecification = require('./docs/swagger-options');

// Initialize Express app
const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

router.use('/api', v1Routes);
router.use(
  '/api/v1/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(openapiSpecification),
);

app.use(router);

// Send custom 404 for any unknown request
app.use((req, res, next) => {
  next(new ApiError(404, 'Not found'));
});

app.use(errorHandler);

module.exports = app;
