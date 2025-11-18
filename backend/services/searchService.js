// src/services/searchService.js
import typesenseClient from '../lib/typesense.js'

// Ensure collection exists (idempotent)
export async function ensureProductCollection() {
  const schema = {
    name: 'products',
    enable_nested_fields: true,
    fields: [
      { name: 'id', type: 'string' },
      { name: 'title', type: 'string', locale: 'fa' }, // Persian support!
      { name: 'description', type: 'string', locale: 'fa' },
      { name: 'price', type: 'float' },
      { name: 'category', type: 'string', facet: true },
      { name: 'brand', type: 'string', facet: true },
      { name: 'in_stock', type: 'bool' },
      { name: 'created_at', type: 'int64' }, // unix timestamp
    ],
    default_sorting_field: 'price',
  };

  try {
    await typesenseClient.collections('products').create(schema);
    console.log('📦 Created Typesense "products" collection');
  } catch (e) {
    if (e.httpStatus !== 409) throw e; // 409 = already exists
  }
}

// 🔍 Search products
export async function searchProducts(query, options = {}) {
  const {
    category,
    brand,
    minPrice,
    maxPrice,
    page = 1,
    perPage = 10,
  } = options;

  const searchParams = {
    q: query || '*',
    query_by: 'title,description',
    filter_by: [
      category && `category:=${category}`,
      brand && `brand:=${brand}`,
      minPrice !== undefined && `price:>=${minPrice}`,
      maxPrice !== undefined && `price:<=${maxPrice}`,
    ]
      .filter(Boolean)
      .join(' && '),
    sort_by: '_text_match(burst):desc,price:desc',
    page,
    per_page: perPage,
    highlight_fields: 'title,description',
    highlight_affix_num_tokens: 5,
    locale: 'fa', // Enable Persian stemming & tokenization
  };

  try {
    const results = await typesenseClient
      .collections('products')
      .documents()
      .search(searchParams);

    return {
      hits: results.hits?.map(h => h.document) || [],
      total: results.found || 0,
      page,
      perPage,
    };
  } catch (error) {
    console.error('Search failed:', error.message);
    throw new Error(`Search error: ${error.message}`);
  }
}

// ➕ Index a product (e.g., after MongoDB insert/update)
export async function indexProduct(product) {
  // Map your MongoDB product → Typesense schema
  const doc = {
    id: product._id.toString(),
    title: product.title || '',
    description: product.description || '',
    price: parseFloat(product.price) || 0,
    category: product.category || '',
    brand: product.brand || '',
    in_stock: Boolean(product.stock > 0),
    created_at: Math.floor(new Date(product.createdAt).getTime() / 1000),
  };

  try {
    const result = await typesenseClient
      .collections('products')
      .documents()
      .upsert(doc); // upsert = insert or update
    return result;
  } catch (err) {
    console.error('Indexing failed for product', product._id, ':', err.message);
    throw err;
  }
}