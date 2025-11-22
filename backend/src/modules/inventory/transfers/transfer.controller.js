import * as transferService from './transfer.service.js';

export const getAllTransfers = async (req, res, next) => {
  try {
    const transfers = await transferService.getAllTransfers(req.query);
    res.json({
      success: true,
      data: transfers,
    });
  } catch (error) {
    next(error);
  }
};

export const getTransferById = async (req, res, next) => {
  try {
    const transfer = await transferService.getTransferById(req.params.id);
    res.json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    next(error);
  }
};

export const createTransfer = async (req, res, next) => {
  try {
    const transfer = await transferService.createTransfer(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    next(error);
  }
};

export const addTransferItem = async (req, res, next) => {
  try {
    const item = await transferService.addTransferItem(req.params.id, req.body);
    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransferStatus = async (req, res, next) => {
  try {
    const transfer = await transferService.updateTransferStatus(
      req.params.id,
      req.body.status
    );
    res.json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    next(error);
  }
};

export const validateTransfer = async (req, res, next) => {
  try {
    const transfer = await transferService.validateTransfer(req.params.id);
    res.json({
      success: true,
      data: transfer,
      message: 'Transfer validated and stock updated',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransferItem = async (req, res, next) => {
  try {
    await transferService.deleteTransferItem(req.params.id, req.params.itemId);
    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

