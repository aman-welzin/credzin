import { useSelector, useDispatch } from "react-redux";

const Cart = () => {
  const cart = useSelector((state) => state.cart.cart);

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 from-blue-50 via-gray-100 p-4 rounded-lg">
              {cart.map((card) => (
                <div
                  key={card._id}
                  className="p-2 sm:p-0 flex flex-col transform transition-all duration-500 w-full"
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