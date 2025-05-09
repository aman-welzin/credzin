import React, { useState, useEffect } from "react";
import Dropdown from "../component/Drpdown";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../app/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import Cart from "../component/Cart";
import { apiEndpoint } from "../api";

const Home = ({ isManageCardsVisible, setIsManageCardsVisible }) => {
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
        delete newCheckedItems[card._id];
      } else {
        newCheckedItems[card._id] = card;
      }
      return newCheckedItems;
    });

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
    const selectedCards = Object.values(checkedItems);
    const selectedCardIds = selectedCards.map((card) => card._id);
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
        setIsManageCardsVisible(false); // Hide the Manage Cards section
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100 flex items-center justify-center p-0 sm:p-0 md:p-0">
      <div className="w-full h-full bg-white rounded-none shadow-lg p-0 sm:p-0 md:p-0 transform transition-all duration-300 hover:shadow-xl relative">
        {/* Buttons and Cart Section */}
        <div className="flex flex-col items-center space-y-6 mt-6">
          <div className="w-full">
            <Cart />
          </div>
          <div className="flex justify-center gap-14 w-full">
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
        </div>

        {/* Additional Boxes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 mb-8 mx-4">
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