import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../app/slices/cartSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiEndpoint } from "../api";

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleRemoveCard = async (cardId) => {
    try {
      const response = await axios.post(
        `${apiEndpoint}/api/v1/auth/removeCardFromCart`,
        { cardId },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Remove Card Response:", response);
      if (response.status === 200) {
        dispatch(removeFromCart(cardId));
      }
    } catch (error) {
      console.error("Error removing card:", error);
    }
  };

  return (
    <div className="h-30 w-full bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cart.map((card) => (
                <div
                  key={card._id}
                  className="bg-white rounded-xl shadow-lg p-6 flex flex-col transform transition-all duration-300 hover:shadow-xl"
                >
                  {/* Card Image */}
                  <img
                    src={card.image_url || "https://via.placeholder.com/150"}
                    alt={card.card_name}
                    className="w-full h-40 object-cover rounded-md mb-4 border border-gray-200"
                  />

                  {/* Card Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-indigo-700 mb-2">
                      {card.card_name}
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Bank: <span className="font-medium">{card.bank_name}</span>
                    </p>
                    <p className="text-gray-600 text-sm">
                      Features: <span className="font-medium">{card.features || "N/A"}</span>
                    </p>
                    <p className="text-red-500 text-sm">
                      Joining Fee: <span className="font-medium">{card.joining_fee || "N/A"}</span>
                    </p>
                    <p className="text-red-500 text-sm">
                      Annual Fee: <span className="font-medium">{card.annual_fee || "N/A"}</span>
                    </p>
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