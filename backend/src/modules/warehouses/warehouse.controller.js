import * as warehouseService from './warehouse.service.js';

export const getAllWarehouses = async (req, res, next) => {
  try {
    const warehouses = await warehouseService.getAllWarehouses();
    res.json({
      success: true,
      data: warehouses,
    });
  } catch (error) {
    next(error);
  }
};

export const getWarehouseById = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.getWarehouseById(req.params.id);
    res.json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
};

export const createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.createWarehouse(req.body);
    res.status(201).json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await warehouseService.updateWarehouse(req.params.id, req.body);
    res.json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWarehouse = async (req, res, next) => {
  try {
    await warehouseService.deleteWarehouse(req.params.id);
    res.json({
      success: true,
      message: 'Warehouse deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getWarehouseStock = async (req, res, next) => {
  try {
    const stock = await warehouseService.getWarehouseStock(req.params.id);
    res.json({
      success: true,
      data: stock,
    });
  } catch (error) {
    next(error);
  }
};

