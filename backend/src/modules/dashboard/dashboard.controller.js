import * as dashboardService from './dashboard.service.js';

export const getDashboardKPIs = async (req, res, next) => {
  try {
    // If the user is warehouse staff, scope KPIs to their assigned warehouse
    const warehouseId = req.query.warehouseId || (req.user && req.user.role === 'WAREHOUSE_STAFF' ? req.user.warehouseId : null);
    const kpis = await dashboardService.getDashboardKPIs(warehouseId);
    res.json({
      success: true,
      data: kpis,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockByCategory = async (req, res, next) => {
  try {
    // Get warehouseId from query or user's assigned warehouse
    const warehouseId = req.query.warehouseId || (req.user.role === 'WAREHOUSE_STAFF' ? req.user.warehouseId : null);
    const data = await dashboardService.getStockByCategory(warehouseId);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getStockHistory = async (req, res, next) => {
  try {
    const warehouseId = req.query.warehouseId || (req.user.role === 'WAREHOUSE_STAFF' ? req.user.warehouseId : null);
    const days = parseInt(req.query.days) || 30;
    const data = await dashboardService.getStockHistory(warehouseId, days);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getWarehouseStockDistribution = async (req, res, next) => {
  try {
    const data = await dashboardService.getWarehouseStockDistribution();
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const warehouseId = req.query.warehouseId || (req.user.role === 'WAREHOUSE_STAFF' ? req.user.warehouseId : null);
    const limit = parseInt(req.query.limit) || 10;
    const data = await dashboardService.getTopProducts(warehouseId, limit);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

