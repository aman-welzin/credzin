import React, { useState } from "react";
import Dropdown from "../component/Drpdown"; 
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../app/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import Cart from "../component/Cart";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const options = [
    { label: "Select Bank", value: "Bank" },
    { label: "Axis Bank", value: "Axis Bank" },
    { label: "SBI Bank", value: "SBI Bank" },
    { label: "HDFC Bank", value: "HDFC Bank" },
  ];

  const [value, setValue] = useState(options[0].value);
  const [bankCard, setBankCard] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const handleChange = async (event) => {
    const selectedBank = event.target.value;
    setValue(selectedBank);

    try {
      const response = await axios.post("http://localhost:5000/api/v1/auth/your_recomendation", {
        bank_name: selectedBank,
      });
      console.log(`this is response from the bank ${response}`);
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
        delete newCheckedItems[card._id]; // Remove if already selected
      } else {
        newCheckedItems[card._id] = card; // Store the whole card object
      }
      return newCheckedItems;
    });
  };

  const handleAddToCart = async () => {
    const selectedCards = Object.values(checkedItems); // Get full card details
    const selectedCardIds = selectedCards.map((card) => card._id); // Extract only card IDs
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/addcard",
        { productIds: selectedCardIds },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(addToCart(selectedCards));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl relative">
        {/* Logout Button in Top-Right Corner */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 transition-all duration-300 font-semibold"
        >
          Logout
        </button>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Choose Your Bank Card
          </h2>
          <p className="text-gray-500">
            Select a bank and add your preferred cards
          </p>
        </div>

        {/* Dropdown Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Which bank do you use?
          </label>
          <Dropdown
            label="Which card do you own?"
            options={options}
            value={value}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
          />
          <p className="mt-2 text-sm text-gray-600">
            You have selected: <span className="font-semibold text-blue-600">{value}</span>
          </p>
        </div>

        {/* Scrollable Bank Cards Section */}
        {bankCard.length > 0 && (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Cards</h3>
    <div className="h-64 w-full overflow-y-auto bg-gray-50 rounded-lg border border-gray-200 p-4">
      {bankCard.map((card) => (
        <label
          key={card._id}
          className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={checkedItems[card._id] || false}
              onChange={() => handleCheckboxChange(card)}
              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-400"
            />
            <span className="text-gray-700">{card.card_name}</span>
          </div>
          {/* <img
            src={card.imageUrl || 'default-card-thumbnail.png'}
            alt={`${card.card_name} thumbnail`}
            className="h-8 w-12 object-cover rounded-sm"
          /> */}
        </label>
      ))}
    </div>
  </div>
)}

        {/* Buttons and Cart Section */}
        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={handleAddToCart}
            className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 font-semibold"
          >
            Add Your Card
          </button>
          <div className="w-full">
            <Cart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;