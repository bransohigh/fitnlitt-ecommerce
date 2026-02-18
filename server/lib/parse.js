/**
 * Parse utilities for query parameters
 * Handles safe parsing with validation and defaults
 */

/**
 * Parse comma-separated string into array
 * @param {string} value - Comma-separated values
 * @returns {string[]} - Array of trimmed non-empty strings
 */
function parseCommaSeparated(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
}

/**
 * Parse boolean string
 * @param {string} value - String value
 * @returns {boolean|null} - Boolean or null if invalid
 */
function parseBoolean(value) {
  if (!value) return null;
  const normalized = String(value).toLowerCase();
  if (normalized === 'true' || normalized === '1') return true;
  if (normalized === 'false' || normalized === '0') return false;
  return null;
}

/**
 * Parse positive integer
 * @param {string} value - String value
 * @param {number} defaultValue - Default if invalid
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Parsed integer within bounds
 */
function parsePositiveInt(value, defaultValue = 1, min = 1, max = Infinity) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < min) return Math.max(defaultValue, min);
  return Math.min(parsed, max);
}

/**
 * Parse positive number (decimal)
 * @param {string} value - String value
 * @param {number} defaultValue - Default if invalid
 * @param {number} min - Minimum value
 * @returns {number|null} - Parsed number or null
 */
function parsePositiveNumber(value, defaultValue = null, min = 0) {
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < min) return defaultValue;
  return parsed;
}

/**
 * Parse sort parameter into field and order
 * @param {string} value - Sort value (e.g., 'price_asc', 'newest')
 * @returns {Object} - {field, order} object
 */
function parseSortParam(value) {
  const validSorts = {
    recommended: { orderBy: [{ field: 'is_featured', order: 'desc' }, { field: 'created_at', order: 'desc' }] },
    newest: { orderBy: [{ field: 'created_at', order: 'desc' }] },
    price_asc: { orderBy: [{ field: 'price', order: 'asc' }] },
    price_desc: { orderBy: [{ field: 'price', order: 'desc' }] },
  };

  return validSorts[value] || validSorts.recommended;
}

/**
 * Parse include parameter for related data
 * @param {string} value - Comma-separated includes
 * @returns {Set} - Set of includes
 */
function parseIncludes(value) {
  const includes = parseCommaSeparated(value);
  const validIncludes = ['images', 'variants', 'collection', 'facets'];
  return new Set(includes.filter(inc => validIncludes.includes(inc)));
}

/**
 * Parse facet filters from query params
 * @param {Object} query - Express req.query object
 * @returns {Object} - Parsed filters
 */
function parseProductFilters(query) {
  return {
    collection: query.collection || null,
    collections: parseCommaSeparated(query.collections),
    q: query.q || null,
    sort: query.sort || 'recommended',
    page: parsePositiveInt(query.page, 1, 1, 1000),
    limit: parsePositiveInt(query.limit, 24, 1, 60),
    sizes: parseCommaSeparated(query.size || query.sizes),
    colors: parseCommaSeparated(query.color || query.colors),
    inStock: parseBoolean(query.inStock),
    onSale: parseBoolean(query.onSale),
    featured: parseBoolean(query.featured),
    priceMin: parsePositiveNumber(query.priceMin, null, 0),
    priceMax: parsePositiveNumber(query.priceMax, null, 0),
    include: parseIncludes(query.include),
  };
}

module.exports = {
  parseCommaSeparated,
  parseBoolean,
  parsePositiveInt,
  parsePositiveNumber,
  parseSortParam,
  parseIncludes,
  parseProductFilters,
};
