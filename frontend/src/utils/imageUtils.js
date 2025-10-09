/**
 * Utility functions for handling product images
 */

/**
 * Get the first image from a product's images array or string
 * @param {Array|string} images - Product images (can be array or string)
 * @param {string} fallback - Fallback image URL
 * @returns {string} - Image URL to display
 */
export const getProductImage = (images, fallback = '/images/placeholder-product.png') => {
  if (!images) return fallback;
  
  if (Array.isArray(images)) {
    return images[0] || fallback;
  }
  
  if (typeof images === 'string') {
    return images || fallback;
  }
  
  return fallback;
};

/**
 * Get all images from a product's images array or string
 * @param {Array|string} images - Product images (can be array or string)
 * @returns {Array} - Array of image URLs
 */
export const getAllProductImages = (images) => {
  if (!images) return [];
  
  if (Array.isArray(images)) {
    return images.filter(img => img && typeof img === 'string');
  }
  
  if (typeof images === 'string') {
    return [images];
  }
  
  return [];
};

/**
 * Check if product has valid images
 * @param {Array|string} images - Product images (can be array or string)
 * @returns {boolean} - True if product has valid images
 */
export const hasValidImages = (images) => {
  if (!images) return false;
  
  if (Array.isArray(images)) {
    return images.length > 0 && images.some(img => img && typeof img === 'string');
  }
  
  if (typeof images === 'string') {
    return images.length > 0;
  }
  
  return false;
};

/**
 * Handle image error by setting fallback
 * @param {Event} event - Image error event
 * @param {string} fallback - Fallback image URL
 */
export const handleImageError = (event, fallback = '/images/placeholder-product.png') => {
  if (event.target.src !== fallback) {
    event.target.src = fallback;
  }
};

/**
 * Convert local image path to full URL
 * @param {string} imagePath - Local image path
 * @returns {string} - Full URL for the image
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/placeholder-product.png';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Get backend URL from environment variable
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // If it's a local path, prepend the backend URL
  if (imagePath.startsWith('/uploads/')) {
    return `${backendUrl}${imagePath}`;
  }
  
  // If it's a relative path, prepend the backend URL
  if (imagePath.startsWith('uploads/')) {
    return `${backendUrl}/${imagePath}`;
  }
  
  return imagePath;
};
