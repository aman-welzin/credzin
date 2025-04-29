import React, { useState, useEffect } from "react";
import Dropdown from "../component/Drpdown";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../app/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import Cart from "../component/Cart";
import { apiEndpoint } from "../api";

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

  // Fetch selected cards from the backend on page load
  useEffect(() => {
    const fetchSelectedCards = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/api/v1/auth/selectedcards`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const selectedCards = response.data?.selectedCards || [];
        const checkedItemsMap = {};
        selectedCards.forEach((card) => {
          checkedItemsMap[card._id] = card;
        });
        setCheckedItems(checkedItemsMap);
      } catch (error) {
        console.error("Error fetching selected cards:", error);
      }
    };

    fetchSelectedCards();
  }, [token]);

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

  const handleCheckboxChange = async (card) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = { ...prevCheckedItems };
      if (newCheckedItems[card._id]) {
        delete newCheckedItems[card._id]; // Remove if already selected
      } else {
        newCheckedItems[card._id] = card; // Store the whole card object
      }
      return newCheckedItems;
    });

    // Update the backend with the new selected cards
    try {
      await axios.post(
        `${apiEndpoint}/api/v1/auth/updateSelectedCards`,
        { selectedCards: Object.values(checkedItems) },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating selected cards:", error);
    }
  };

  const handleAddToCart = async () => {
    const selectedCards = Object.values(checkedItems); // Get full card details
    const selectedCardIds = selectedCards.map((card) => card._id); // Extract only card IDs
    try {
      const response = await axios.post(
        `${apiEndpoint}/api/v1/auth/addcard`,
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full h-full bg-white rounded-none shadow-lg p-4 sm:p-6 md:p-8 transform transition-all duration-300 hover:shadow-xl relative">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-4">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
            Choose Your Bank Cards
          </h2>
        </div>

        {/* Dropdown and Scrollable Bank Cards Section */}
        <div className="flex flex-col md:flex-row md:space-x-6 w-full">
          {/* Dropdown Section */}
          <div className="flex flex-col justify-center items-center bg-gray-50 border border-gray-200 rounded-lg p-4 w-full md:w-1/3 h-64">
            <Dropdown
              label="Select issuer bank"
              options={options}
              value={value}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
            />
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              You have selected: <span className="font-semibold text-blue-600">{value}</span>
            </p>
          </div>

          {/* Scrollable Bank Cards Section */}
          <div className="flex flex-col justify-center items-center bg-gray-50 border border-gray-200 rounded-lg p-4 w-full md:w-2/3 h-64 overflow-y-auto">
            {bankCard.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 w-full">
                {bankCard.map((card) => (
                  <label
                    key={card._id}
                    className="flex items-center justify-between p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
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
              <p className="text-sm text-gray-500">No cards available.</p>
            )}
          </div>
        </div>

        {/* Buttons and Cart Section */}
        <div className="flex flex-col items-center space-y-6 mt-6">
          <div className="flex justify-center gap-14 w-full">
          <button
              onClick={handleAddToCart}
              className="w-40 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 font-semibold"
            >
              Add Your Card
            </button>
            <button
              onClick={() => navigate("/paybill")}
              className="w-40 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 font-semibold"
            >
              Pay Bill
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="w-40 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all duration-300 font-semibold"
            >
              Shop
            </button>
          </div>
          <div className="w-full">
            <Cart />
          </div>
        </div>

        {/* Additional Boxes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {/* Recommended Cards Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Recommended Cards</h3>
            <p className="text-sm text-gray-600">
              We recommend you best card according to your selected cards.
            </p>
          </div>

          {/* Benefits Box */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Benefits</h3>
            <p className="text-sm text-gray-600">
              Discover the exclusive benefits and rewards of your selected cards.
            </p>
          </div>

          {/* Offers Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Offers</h3>
            <p className="text-sm text-gray-600">
              Check out the latest offers and discounts available for your cards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

