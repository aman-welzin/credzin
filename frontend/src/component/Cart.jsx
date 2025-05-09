import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../app/slices/cartSlice";
import axios from "axios";
import { apiEndpoint } from "../api";

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const handleRemoveCard = async (cardId) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/api/v1/auth/removeCardFromCart`,
        { cardId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(removeFromCart(cardId));
      }
    } catch (error) {
      console.error("Error removing card:", error);
    }
  };

  return (
    <div className="h-auto w-full bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 p-0 lg:p-2">
      <div className="max-w-0xl mx-auto">
        {/* Header */}
        <div className="mb-0">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Cards in your account
          </h2>
        </div>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            No items in the cart
          </p>
        ) : (
          <div className="h-[70vh] overflow-y-auto">
            {/* Updated Background for Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 p-4 rounded-lg">
              {cart.map((card) => (
                <div
                  key={card._id}
                  className="bg-gradient-to-br rounded-xl shadow-lg p-4 sm:p-6 flex flex-col transform transition-all duration-300 hover:shadow-xl w-full"
                >
                  {/* Card Flip Effect */}
                  <div className="relative w-full h-40 sm:h-50 rounded-md overflow-hidden group perspective">
                    <div className="w-full h-full transition-transform duration-500 preserve-3d group-hover:rotate-y-180 relative">
                      {/* Front Side */}
                      <div className="absolute inset-0 backface-hidden flex items-center justify-center">
                        <img
                          src={card.image_url || "https://via.placeholder.com/150"}
                          alt={card.card_name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Back Side */}
                      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-black bg-opacity-70 text-white flex flex-col justify-center items-center px-2 text-center">
                        <h3 className="text-base font-bold">{card.card_name}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveCard(card._id)}
                    className="mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition-all duration-300 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;