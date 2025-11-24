import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlist, selectIsInWishlist } from '../redux/slices/wishlistSlice';

const Card = ({ id, title, price, category, image }) => {
    const dispatch = useDispatch();
    const isWishlisted = useSelector(state => selectIsInWishlist(state, id));

    const handleAddToCart = (e) => {
        e.preventDefault();
        dispatch(addToCart({ id, title, price, category, image }));
        alert('Added to Cart!');
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        dispatch(toggleWishlist({ id, title, price, category, image }));
    };

    return (
        <Link to={`/product/${id}`} className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="relative h-80 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Quick Actions */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-300 px-4">
                    <button
                        onClick={handleAddToCart}
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg"
                    >
                        <ShoppingCart size={16} />
                        Add to Cart
                    </button>
                    <button
                        onClick={handleToggleWishlist}
                        className={`p-2 rounded-full shadow-lg transition-colors ${isWishlisted ? 'bg-rose-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-rose-500 hover:text-white'}`}
                    >
                        <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            <div className="p-6">
                <p className="text-sm text-blue-600 dark:text-blue-400 font-bold mb-2 uppercase tracking-wider">{category}</p>
                <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{title}</h3>
                <p className="text-xl font-black text-gray-900 dark:text-white">${price}</p>
            </div>
        </Link>
    );
};

export default Card;
