import { useState, useEffect, useRef } from 'react';

export default function SearchScreen() {
  // 🔍 Search state
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000000]); // IRR
  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // 📦 Filters
  const categories = ['electronics', 'clothing', 'home', 'books']; // ← get from API/facets
  const brands = ['Samsung', 'Apple', 'Irancell', 'Pars']; // ← dynamic later

  const observer = useRef();

  // 🔁 Fetch results
  const fetchResults = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query.trim() || '*',
        category,
        brand,
        minPrice: priceRange[0] || '',
        maxPrice: priceRange[1] || '',
        page: pageNum,
        limit: 12,
      });

      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();

      if (!data.success) throw new Error('Search failed');

      if (pageNum === 1) {
        setResults(data.hits);
      } else {
        setResults(prev => [...prev, ...data.hits]);
      }

      setTotal(data.total);
      setHasMore(data.hits.length > 0 && data.hits.length + (pageNum - 1) * 12 < data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Refetch on filter/query change
  useEffect(() => {
    setPage(1);
    fetchResults(1);
  }, [query, category, brand, priceRange]);

  // 📜 Load more (infinite scroll)
  useEffect(() => {
    if (page > 1) fetchResults(page);
  }, [page]);

  // 🧭 Intersection Observer for "Load More"
  useEffect(() => {
    if (!hasMore || loading) return;

    const observerElement = observer.current;
    const observerInstance = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerElement) observerInstance.observe(observerElement);
    return () => observerInstance.disconnect();
  }, [hasMore, loading]);

  // 🎯 Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    // (already triggers useEffect)
  };

  return (
    <div className="search-screen" style={{ direction: 'rtl', fontFamily: 'Vazirmatn, sans-serif' }}>
      {/* 🔎 Search & Filters */}
      <div className="filters p-4 bg-gray-50 border-b">
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی محصولات..."
            className="flex-1 p-2 border rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
          >
            جستجو
          </button>
        </form>

        {/* Optional: Category/Brand Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">همه دسته‌ها</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
          value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">همه برندها</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          {/* Price range slider (simplified) */}
          <div>
            <label className="block">قیمت: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} تومان</label>
            <input
              type="range"
              min="0"
              max="20000000"
              step="100000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* 📦 Results */}
      <div className="results p-4">
        {error && <div className="text-red-500 p-4">❌ {error}</div>}

        {loading && page === 1 && (
          <div className="text-center py-8">در حال جستجو...</div>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(product => (
              <div key={product.id} className="border rounded-lg p-3 hover:shadow-md">
                <h3 className="font-bold">{product.title}</h3>
                <p className="text-gray-600 text-sm">{product.description?.slice(0, 60)}...</p>
                <p className="text-green-600 font-semibold mt-2">
                  {product.price.toLocaleString()} تومان
                </p>
                {product.category && (
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded mt-2 inline-block">
                    {product.category}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center py-10 text-gray-500">موردی یافت نشد.</div>
        ) : null}

        {/* 📥 Load More / Infinite Scroll Sentinel */}
        {hasMore && (
          <div ref={observer} className="py-4 text-center">
            {loading && page > 1 ? 'در حال بارگذاری...' : '↓'}
          </div>
        )}

        {/* Optional: Manual "Load More" Button */}
        {/* <button
          onClick={() => setPage(p => p + 1)}
          disabled={!hasMore || loading}
          className="mt-4 px-4 py-2 bg-gray-200 disabled:opacity-50"
        >
          {loading ? 'بارگذاری...' : 'نمایش بیشتر'}
        </button> */}
      </div>
    </div>
  );
};

