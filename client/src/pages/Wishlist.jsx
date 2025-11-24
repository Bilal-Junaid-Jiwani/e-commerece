import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectWishlistItems, toggleWishlist, fetchWishlist } from '../redux/slices/wishlistSlice';
import { addToCart } from '../redux/slices/cartSlice';
import Button from '../components/Button';

const Wishlist = () => {
    const wishlist = useSelector(selectWishlistItems);
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (user) {
            dispatch(fetchWishlist(user.id));
        }
    }, [dispatch, user]);

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        dispatch(toggleWishlist(product));
    };

    if (wishlist.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Your Wishlist is Empty</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">Save items you love to buy later.</p>
                <Link to="/shop">
                    <Button variant="primary">Explore Products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Wishlist</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {wishlist.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                        <div className="relative aspect-square mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{item.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{item.category}</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white mb-4">${item.price}</p>
                        </div>

                        <div className="flex gap-3 mt-auto">
                            <Button
                                variant="primary"
                                className="flex-1 flex items-center justify-center gap-2 !py-3"
                                onClick={() => handleAddToCart(item)}
                            >
                                <ShoppingCart size={18} />
                                Add to Cart
                            </Button>
                            <button
                                onClick={() => dispatch(toggleWishlist(item))}
                                className="p-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
