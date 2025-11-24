import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/Button';
import { Star, Truck, Shield, RefreshCw, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../redux/slices/wishlistSlice';
import { selectUser } from '../redux/slices/authSlice';

const ProductDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);

    // We need to pass the product ID to the selector. 
    // Since hooks can't be conditional, we pass a dummy ID if product is null, 
    // but the result won't matter until product is loaded.
    const isWishlisted = useSelector(state => selectIsInWishlist(state, product ? product.id : -1));

    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && !data.images && data.image) {
                    data.images = [data.image];
                }
                setProduct(data);
                setSelectedImage(data.images ? data.images[0] : data.image);
                if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
                if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
                setLoading(false);

                // Fetch related products
                fetch(`${API_URL}/api/products/${id}/related`)
                    .then(res => res.json())
                    .then(related => setRelatedProducts(related))
                    .catch(err => console.error('Error fetching related products:', err));
            })
            .catch(err => console.error('Error fetching product:', err));
    }, [id]);

    const handleToggleWishlist = () => {
        if (product) {
            dispatch(toggleWishlist(product));
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                        <img src={selectedImage || (product.images ? product.images[0] : product.image)} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {product.images && product.images.map((img, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedImage(img)}
                                className={`aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer border-2 transition-colors ${selectedImage === img ? 'border-blue-500' : 'border-transparent hover:border-blue-500'}`}
                            >
                                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2">{product.title}</h1>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl font-bold text-blue-600">${product.price}</span>
                            <div className="flex items-center text-yellow-400">
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" className="text-gray-300" />
                                <span className="text-gray-500 text-sm ml-2">(128 reviews)</span>
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Options */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold mb-3 text-gray-900">Color</h3>
                            <div className="flex gap-3">
                                {product.colors && product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 shadow-md ring-2 transition-all ${selectedColor === color ? 'ring-blue-500 border-white' : 'ring-transparent border-white hover:ring-blue-200'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-3 text-gray-900">Size</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes && product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded-lg transition-colors ${selectedSize === size ? 'border-blue-500 bg-blue-50 text-blue-600 font-bold' : 'border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4">
                        <Button variant="primary" className="flex-1 !py-4 text-lg" onClick={() => dispatch(addToCart({ ...product, selectedColor, selectedSize }))}>Add to Cart</Button>
                        <Button
                            variant="secondary"
                            className={`!p-4 transition-colors ${isWishlisted ? 'text-rose-500 border-rose-200 bg-rose-50' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={handleToggleWishlist}
                        >
                            <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                        </Button>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-100">
                        <div className="flex flex-col items-center text-center gap-2">
                            <Truck size={24} className="text-blue-600" />
                            <span className="text-xs font-medium text-gray-600">Free Shipping</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <Shield size={24} className="text-blue-600" />
                            <span className="text-xs font-medium text-gray-600">2 Year Warranty</span>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <RefreshCw size={24} className="text-blue-600" />
                            <span className="text-xs font-medium text-gray-600">30 Day Returns</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="border-t border-gray-100 pt-16 mb-16">
                    <h2 className="text-2xl font-black text-gray-900 mb-8">You Might Also Like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map(related => (
                            <div key={related.id} className="group">
                                <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-4 relative">
                                    <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    <Button
                                        variant="primary"
                                        className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                        onClick={() => window.location.href = `/product/${related.id}`}
                                    >
                                        View Product
                                    </Button>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1 truncate">{related.title}</h3>
                                <p className="text-blue-600 font-bold">${related.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <Reviews productId={product.id} />
        </div>
    );
};

const Reviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const user = useSelector(selectUser);

    useEffect(() => {
        fetch(`${API_URL}/api/products/${productId}/reviews`)
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(err => console.error(err));
    }, [productId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user) return alert('Please login to review');

        fetch(`${API_URL}/api/products/${productId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                userName: user.name,
                ...newReview
            })
        })
            .then(res => res.json())
            .then(review => {
                setReviews([review, ...reviews]);
                setNewReview({ rating: 5, comment: '' });
            });
    };

    return (
        <div className="border-t border-gray-100 pt-16">
            <h2 className="text-2xl font-black text-gray-900 mb-8">Customer Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map(review => (
                            <div key={review.id} className="bg-gray-50 p-6 rounded-2xl">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-bold text-gray-900">{review.userName}</p>
                                        <div className="flex text-yellow-400 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-600">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setNewReview({ ...newReview, rating: star })}
                                        className={`text-2xl transition-colors ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                            <textarea
                                required
                                value={newReview.comment}
                                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                                placeholder="Share your thoughts..."
                            />
                        </div>
                        <Button variant="primary" className="w-full" disabled={!user}>
                            {user ? 'Submit Review' : 'Login to Review'}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
