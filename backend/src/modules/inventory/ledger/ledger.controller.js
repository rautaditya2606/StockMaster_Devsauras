import * as ledgerService from './ledger.service.js';

export const getLedgerEntries = async (req, res, next) => {
  try {
    const entries = await ledgerService.getLedgerEntries(req.query);
    res.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductLedger = async (req, res, next) => {
  try {
    const entries = await ledgerService.getProductLedger(req.params.productId, req.query);
    res.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    next(error);
  }
};

export const getWarehouseLedger = async (req, res, next) => {
  try {
    const entries = await ledgerService.getWarehouseLedger(req.params.warehouseId, req.query);
    res.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    next(error);
  }
};

