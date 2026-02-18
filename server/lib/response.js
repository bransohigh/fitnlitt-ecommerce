/**
 * Standardized API response formatters
 */

/**
 * Success response (200 OK)
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {number} status - HTTP status code
 */
function ok(res, data, status = 200) {
  res.status(status).json(data);
}

/**
 * Bad request response (400)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 */
function badRequest(res, message = 'Bad Request', details = null) {
  const response = {
    error: 'Bad Request',
    message,
    timestamp: new Date().toISOString(),
  };
  if (details) response.details = details;
  res.status(400).json(response);
}

/**
 * Not found response (404)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
function notFound(res, message = 'Resource not found') {
  res.status(404).json({
    error: 'Not Found',
    message,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Server error response (500)
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {Error} error - Original error object (for logging)
 */
function serverError(res, message = 'Internal Server Error', error = null) {
  if (error) {
    console.error('Server Error:', error);
  }
  res.status(500).json({
    error: 'Internal Server Error',
    message,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Format paginated listing response
 * @param {Array} items - Data items
 * @param {number} total - Total count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {Object} facets - Facets data (optional)
 */
function paginatedResponse(items, total, page, limit, facets = null) {
  const totalPages = Math.ceil(total / limit);
  const response = {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
  if (facets) {
    response.facets = facets;
  }
  return response;
}

module.exports = {
  ok,
  badRequest,
  notFound,
  serverError,
  paginatedResponse,
};
