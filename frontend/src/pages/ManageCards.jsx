import React, { useState, useEffect } from "react";
import Dropdown from "../component/Drpdown"; // Adjusted path for Dropdown
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../app/slices/cartSlice"; // Redux action for adding to cart
import { apiEndpoint } from "../api"; // Adjusted path for API configuration

const ManageCards = () => {
  const [value, setValue] = useState("Select Bank");
  const [bankCard, setBankCard] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const options = [
    { label: "Select Bank", value: "Bank" },
    { label: "Axis Bank", value: "Axis Bank" },
    { label: "SBI Bank", value: "SBI Bank" },
    { label: "HDFC Bank", value: "HDFC Bank" },
  ];

  const handleChange = async (event) => {
    const selectedBank = event.target.value;
    setValue(selectedBank);

    try {
      const response = await axios.post(`${apiEndpoint}/api/v1/card/your_recomendation`, {
        bank_name: selectedBank,
      });
      const cards = response.data?.cards || [];
      setBankCard(cards);
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err);
      setBankCard([]);
    }
  };

  const handleCheckboxChange = (card) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = { ...prevCheckedItems };
      if (newCheckedItems[card._id]) {
        delete newCheckedItems[card._id];
      } else {
        newCheckedItems[card._id] = card;
      }
      return newCheckedItems;
    });
  };

  const handleAddToCart = async () => {
    const selectedCards = Object.values(checkedItems);
    const selectedCardIds = selectedCards.map((card) => card._id);

    try {
      const response = await axios.post(
        `${apiEndpoint}/api/v1/auth/addcard`,
        { productIds: selectedCardIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(addToCart(selectedCards)); // Add selected cards to Redux store
        alert("Cards added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="mt-6 flex flex-col md:flex-row md:space-x-6 lg:space-x-10 w-full max-w-5xl bg-white rounded-lg shadow-lg p-4 md:p-6 h-[400px]">
        {/* Dropdown Section */}
        <div className="flex flex-col justify-center items-center bg-gray-50 border border-gray-200 rounded-lg p-4 w-full md:w-1/3 h-full">
            <Dropdown
                label="Select issuer bank"
                options={options}
                value={value}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
            />
            <p className="mt-2 text-xs sm:text-sm text-gray-600 text-center">
                You have selected: <span className="font-semibold text-blue-600">{value}</span>
            </p>
        </div>

        {/* Scrollable Bank Cards Section */}
        <div className="flex flex-col justify-center items-center bg-gray-50 border border-gray-200 rounded-lg p-4 w-full md:w-2/3 h-full max-h-[500px] overflow-y-auto">
            {bankCard.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 w-full">
              {bankCard.map((card) => (
                <label
                  key={card._id}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={checkedItems[card._id] || false}
                      onChange={() => handleCheckboxChange(card)}
                      className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
                    />
                    <span className="text-sm sm:text-base text-gray-700">{card.card_name}</span>
                  </div>
                </label>
              ))}
            </div>
            ) : (
            <p className="text-sm text-gray-500 text-center">No cards available.</p>
            )}
            </div>
        </div>

      {/* Add to Cart Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleAddToCart}
          className="w-40 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ManageCards;