// src/routes/search.js
import express from 'express';
import { searchProducts } from '../services/searchService.js';

const searchRouter = express.Router();

searchRouter.get('/', async (req, res) => {
  try {
    const {
      q = '', // search query
      category,
      brand,
      minPrice,
      maxPrice,
      page = 1,
      limit = 12,
    } = req.query;

    const results = await searchProducts(q, {
      category,
      brand,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      page: parseInt(page, 10),
      perPage: parseInt(limit, 10),
    });

    res.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
});

export default searchRouter;
