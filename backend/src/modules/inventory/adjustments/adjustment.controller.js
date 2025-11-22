import * as adjustmentService from './adjustment.service.js';

export const getAllAdjustments = async (req, res, next) => {
  try {
    const adjustments = await adjustmentService.getAllAdjustments(req.query);
    res.json({
      success: true,
      data: adjustments,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdjustmentById = async (req, res, next) => {
  try {
    const adjustment = await adjustmentService.getAdjustmentById(req.params.id);
    res.json({
      success: true,
      data: adjustment,
    });
  } catch (error) {
    next(error);
  }
};

export const createAdjustment = async (req, res, next) => {
  try {
    const adjustment = await adjustmentService.createAdjustment(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: adjustment,
      message: 'Adjustment created and stock updated',
    });
  } catch (error) {
    next(error);
  }
};

