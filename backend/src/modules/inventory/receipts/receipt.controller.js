import * as receiptService from './receipt.service.js';

export const getAllReceipts = async (req, res, next) => {
  try {
    const receipts = await receiptService.getAllReceipts(req.query);
    res.json({
      success: true,
      data: receipts,
    });
  } catch (error) {
    next(error);
  }
};

export const getReceiptById = async (req, res, next) => {
  try {
    const receipt = await receiptService.getReceiptById(req.params.id);
    res.json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    next(error);
  }
};

export const createReceipt = async (req, res, next) => {
  try {
    const receipt = await receiptService.createReceipt(req.body, req.user.id);
    res.status(201).json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    next(error);
  }
};

export const addReceiptItem = async (req, res, next) => {
  try {
    const item = await receiptService.addReceiptItem(req.params.id, req.body);
    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReceiptStatus = async (req, res, next) => {
  try {
    const receipt = await receiptService.updateReceiptStatus(
      req.params.id,
      req.body.status
    );
    res.json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    next(error);
  }
};

export const validateReceipt = async (req, res, next) => {
  try {
    const receipt = await receiptService.validateReceipt(req.params.id);
    res.json({
      success: true,
      data: receipt,
      message: 'Receipt validated and stock updated',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReceiptItem = async (req, res, next) => {
  try {
    await receiptService.deleteReceiptItem(req.params.id, req.params.itemId);
    res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

