import * as deliveryService from './delivery.service.js';

export const getAllDeliveries = async (req, res, next) => {
  try {
    const deliveries = await deliveryService.getAllDeliveries(req.query);
    res.json({
      success: true,
      data: deliveries,
    });
  } catch (error) {
    next(error);
  }
};

export const getDeliveryById = async (req, res, next) => {
  try {
    const delivery = await deliveryService.getDeliveryById(req.params.id);
    res.json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const createDelivery = async (req, res, next) => {
  try {
    const delivery = await deliveryService.createDelivery(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const addDeliveryItem = async (req, res, next) => {
  try {
    const item = await deliveryService.addDeliveryItem(req.params.id, req.body);
    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateDeliveryStatus = async (req, res, next) => {
  try {
    const delivery = await deliveryService.updateDeliveryStatus(
      req.params.id,
      req.body.status
    );
    res.json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

export const validateDelivery = async (req, res, next) => {
  try {
    const delivery = await deliveryService.validateDelivery(req.params.id);
    res.json({
      success: true,
      data: delivery,
      message: 'Delivery validated and stock updated',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDeliveryItem = async (req, res, next) => {
  try {
    await deliveryService.deleteDeliveryItem(req.params.id, req.params.itemId);
    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

