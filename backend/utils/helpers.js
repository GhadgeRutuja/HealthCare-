// Success response helper
const sendSuccessResponse = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    status: 'success',
    message: message || 'Request completed successfully',
    data: data
  });
};

// Error response helper
const sendErrorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    status: 'error',
    message: message || 'An error occurred'
  };

  if (errors) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};

// Pagination helper
const getPagination = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    limit: parseInt(limit),
    offset: parseInt(offset),
    page: parseInt(page)
  };
};

// Generate pagination metadata
const getPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: parseInt(page),
    totalPages,
    totalItems: total,
    itemsPerPage: parseInt(limit),
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

// Format validation errors
const formatValidationErrors = (errors) => {
  return errors.array().map(error => ({
    field: error.param,
    message: error.msg,
    value: error.value
  }));
};

// Generate random ID
const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Format date for display
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

// Check if date is in the future
const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

// Get time slots for a date
const getTimeSlots = (startTime = '09:00', endTime = '17:00', interval = 30) => {
  const slots = [];
  const start = new Date(`2024-01-01 ${startTime}`);
  const end = new Date(`2024-01-01 ${endTime}`);
  
  let current = new Date(start);
  
  while (current < end) {
    slots.push(current.toTimeString().slice(0, 5));
    current.setMinutes(current.getMinutes() + interval);
  }
  
  return slots;
};

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
  getPagination,
  getPaginationMeta,
  formatValidationErrors,
  generateId,
  formatDate,
  isFutureDate,
  getTimeSlots
};
