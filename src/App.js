import axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

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

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const sliceProducts = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const sliced = filterProducts().slice(indexOfFirstItem, indexOfLastItem);
    return sliced;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const handleSearch = (e) => setSearchQuery(e.target.value);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        {loggedIn ? (
          <>
            <p className="text-xl mb-4">Welcome, User! You are logged in.</p>
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Available Products:
              </h2>
              <input
                type="text"
                placeholder="Search products..."
                className="p-2 border rounded mb-4 w-full"
                onChange={handleSearch}
              />
              <ul>
                {sliceProducts().map((product) => (
                  <li key={product.id} className="mb-2">
                    {product.title} - ${product.price}
                  </li>
                ))}
              </ul>
              <nav className="mt-4">
                <ul className="flex">
                  {Array.from({ length: Math.ceil(filterProducts().length / itemsPerPage) }, (_, index) => (
                    <li key={index} className={`mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                      <a href="#!" className="block px-3 py-1" onClick={() => paginate(index + 1)}>
                        {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
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
