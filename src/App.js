import axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/products");

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data && response.data.products) {
        setProducts(response.data.products);
      } else {
        console.error("Invalid response format for products:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleRegistration = async () => {
    alert("User registered successfully!");
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://dummyjson.com/auth/login", {
        username: email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      setLoggedIn(true);
      fetchProducts();
    } catch (error) {
      setError("Invalid email or password");
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setProducts([]);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="w-screen">
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md">
          {loggedIn ? (
            <>
              <p className="text-xl">Welcome, User! You are logged in.</p>
              <div>
                <h2 className="text-lg font-semibold mt-4">
                  Available Products:
                </h2>
                <table className="table-auto mt-2">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td
                          className="cursor-pointer underline text-blue-500"
                          onClick={() => handleProductClick(product)}
                        >
                          {product.title}
                        </td>
                        <td>
                          {/* Add any additional details you want to display */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {selectedProduct && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">Product Details:</h2>
                  <p>Title: {selectedProduct.title}</p>
                  <p>Description: {selectedProduct.description}</p>
                  {/* Add more details as needed */}
                </div>
              )}
              <button
                className="bg-red-500 text-white p-2 rounded mt-4"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Email:
                </label>
                <input
                  type="email"
                  className="mt-1 p-2 border rounded w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  Password:
                </label>
                <input
                  type="password"
                  className="mt-1 p-2 border rounded w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <button
                className="bg-blue-500 text-white p-2 rounded mr-2"
                onClick={handleRegistration}
              >
                Register
              </button>
              <button
                className="bg-green-500 text-white p-2 rounded"
                onClick={handleLogin}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
