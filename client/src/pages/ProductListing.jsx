import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Filter } from 'lucide-react';

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search');

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(1000);
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    // Filter Logic
    const filteredProducts = products.filter(product => {
        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            if (!product.title.toLowerCase().includes(query) &&
                !product.category.toLowerCase().includes(query)) {
                return false;
            }
        }

        // Category Filter
        if (selectedCategory !== 'All' && product.category !== selectedCategory) {
            return false;
        }

        // Price Filter
        if (parseFloat(product.price) > priceRange) {
            return false;
        }

        return true;
    });

    // Pagination Logic
    const visibleProducts = filteredProducts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProducts.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 6);
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 space-y-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Filter size={20} className="text-blue-600 dark:text-blue-400" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h2>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Categories</h3>
                        <div className="space-y-2">
                            {['All', 'Footwear', 'Apparel', 'Accessories', 'Tech'].map(cat => (
                                <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === cat}
                                        onChange={() => {
                                            setSelectedCategory(cat);
                                            setVisibleCount(6); // Reset pagination on filter change
                                        }}
                                        className="rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <span className={`transition-colors ${selectedCategory === cat ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Price Range</h3>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange}
                            onChange={(e) => {
                                setPriceRange(Number(e.target.value));
                                setVisibleCount(6);
                            }}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                            <span>$0</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">${priceRange}</span>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {searchQuery ? `Search: "${searchQuery}"` : 'Shop All'}
                            <span className="text-base font-normal text-gray-500 dark:text-gray-400 ml-4">({filteredProducts.length} items)</span>
                        </h1>
                        <select className="border-gray-200 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                            <option>Sort by: Featured</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest</option>
                        </select>
                    </div>

                    {visibleProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {visibleProducts.map(product => (
                                <Card key={product.id} {...product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            No products found matching your criteria.
                        </div>
                    )}

                    {hasMore && (
                        <div className="mt-12 flex justify-center">
                            <Button variant="outlineDark" onClick={handleLoadMore}>
                                Load More
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductListing;
