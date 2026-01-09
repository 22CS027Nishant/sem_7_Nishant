export const router = require('express').Router();
const portfolioController = require('../controllers/portfolio');

// Route to get the user's portfolio
router.get('/:userId', portfolioController.getPortfolio);

// Route to update the user's portfolio
router.put('/:userId', portfolioController.updatePortfolio);

// Route to add an asset to the user's portfolio
router.post('/:userId/assets', portfolioController.addAsset);

// Route to remove an asset from the user's portfolio
router.delete('/:userId/assets/:assetId', portfolioController.removeAsset);

module.exports = router;