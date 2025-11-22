/**
 * Cache middleware for API responses
 * Sets appropriate cache headers based on route
 */
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method === 'GET') {
      // Set cache control headers
      res.set({
        'Cache-Control': `public, max-age=${duration}, stale-while-revalidate=${duration * 2}`,
        'Vary': 'Authorization', // Cache varies by auth token
      });
    }
    next();
  };
};

/**
 * Route-specific cache durations (in seconds)
 */
export const CACHE_DURATIONS = {
  // Dashboard data - 2 minutes
  '/dashboard/kpis': 120,
  '/dashboard/charts': 180,
  
  // Products - 2 minutes
  '/products': 120,
  
  // Warehouses - 10 minutes (rarely change)
  '/warehouses': 600,
  
  // Inventory documents - 1 minute (change frequently)
  '/receipts': 60,
  '/deliveries': 60,
  '/transfers': 60,
  '/adjustments': 60,
  
  // Ledger - 30 seconds (very dynamic)
  '/ledger': 30,
};

/**
 * Get cache duration for a route
 */
export const getCacheDuration = (path) => {
  for (const [route, duration] of Object.entries(CACHE_DURATIONS)) {
    if (path.includes(route)) {
      return duration;
    }
  }
  return 60; // Default 1 minute
};

