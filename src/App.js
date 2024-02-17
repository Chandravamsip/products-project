import axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

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

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const filterAndSortProducts = () => {
    let filteredAndSorted = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredAndSorted = filteredAndSorted.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    filteredAndSorted = filteredAndSorted.sort((a, b) => {
      const orderFactor = sortOrder === "asc" ? 1 : -1;
      return orderFactor * (a.price - b.price);
    });

    return filteredAndSorted;
  };

  const sliceProducts = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filterAndSortProducts().slice(indexOfFirstItem, indexOfLastItem);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        {loggedIn ? (
          <>
            <p className="text-xl">Welcome, User! You are logged in.</p>
            <div>
              <h2 className="text-lg font-semibold mt-4">
                Available Products:
              </h2>
              <div>
                <input
                  type="text"
                  placeholder="Search by name or description"
                  className="mt-2 p-2 border rounded"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  className="bg-blue-500 text-white p-2 rounded ml-2"
                  onClick={() => setCurrentPage(1)}
                >
                  Search
                </button>
              </div>
              <div className="mt-2">
                <button
                  className="bg-yellow-500 text-white p-2 rounded ml-2"
                  onClick={toggleSortOrder}
                >
                  {sortOrder === "asc" ? "Sort Desc" : "Sort Asc"}
                </button>
              </div>
              <ul>
                {sliceProducts().map((product) => (
                  <li key={product.id}>
                    {product.title} - ${product.price}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                {Array.from({ length: Math.ceil(filterAndSortProducts().length / itemsPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    className={`mr-2 p-2 ${
                      currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                    } rounded`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
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
  );
}

export default App;
