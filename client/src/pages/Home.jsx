import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, bannersRes] = await Promise.all([
                    fetch(`${API_URL}/api/products`),
                    fetch(`${API_URL}/api/banners`)
                ]);

                const products = await productsRes.json();
                const bannersData = await bannersRes.json();

                // Get top 4 products (or random 4)
                setFeaturedProducts(products.slice(0, 4));
                setBanners(bannersData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching home data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden bg-gray-900">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920&q=80"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-2xl space-y-8">
                        <h1 className="text-7xl font-black tracking-tighter text-white leading-tight">
                            WEAR THE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">FUTURE</span>
                        </h1>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            Discover the latest collection of avant-garde streetwear and tech accessories. Designed for the bold.
                        </p>
                        <div className="flex gap-4">
                            <Link to="/shop">
                                <Button variant="primary" className="!text-lg !px-8 !py-4">Shop Collection</Button>
                            </Link>
                            <Link to="/shop">
                                <Button variant="outline" className="!text-lg !px-8 !py-4">View Lookbook</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Trending Now</h2>
                        <p className="text-gray-500 dark:text-gray-400">Curated selection of this season's hottest items.</p>
                    </div>
                    <Link to="/shop">
                        <Button variant="secondary">View All</Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map(product => (
                        <Card key={product.id} {...product} />
                    ))}
                </div>
            </section>

            {/* Promo Section - Dynamic Banners */}
            {banners.length > 0 ? (
                <section className="container mx-auto px-4 space-y-8">
                    {banners.map(banner => (
                        <div key={banner.id} className="relative rounded-3xl overflow-hidden h-[400px] group">
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
                                <h2 className="text-4xl font-black text-white mb-4">{banner.title}</h2>
                                <Link to={banner.link || '/shop'}>
                                    <Button variant="primary" className="self-start">Check it out</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </section>
            ) : (
                /* Fallback Static Promo */
                <section className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-12 md:p-24 text-center text-white relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-5xl font-black tracking-tighter">SUMMER SALE IS ON</h2>
                            <p className="text-xl opacity-90 max-w-2xl mx-auto">Get up to 50% off on selected items. Limited time offer. Don't miss out on the future of fashion.</p>
                            <Link to="/shop">
                                <Button variant="secondary" className="!bg-white !text-blue-600 hover:!bg-gray-100 border-none">Grab the Deal</Button>
                            </Link>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;
