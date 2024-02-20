import axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [registrationFields, setRegistrationFields] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    birthDate: "",
    // Add more fields from the provided data structure
  });

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

  // ... (previous code)

  const handleRegistration = async () => {
    try {
      const response = await axios.post(
        "https://dummyjson.com/users/add",
        registrationFields
      );
      console.log("Registration response:", response);
    } catch (error) {
      setError("Failed to register");
      console.error("Registration failed:", error);
    }
  };

  // ... (remaining code)

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://dummyjson.com/auth/login", {
        username: loginEmail,
        password: loginPassword,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-2/3 lg:w-1/2 xl:w-1/3">
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
                  onClick={() =>
                    setSortOrder((prevOrder) =>
                      prevOrder === "asc" ? "desc" : "asc"
                    )
                  }
                >
                  {sortOrder === "asc" ? "Sort Desc" : "Sort Asc"}
                </button>
              </div>
              <ul>
                {filterAndSortProducts()
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((product) => (
                    <li key={product.id}>
                      {product.title} - ${product.price}
                    </li>
                  ))}
              </ul>

              <div className="mt-4 flex">
                {Array.from({
                  length: Math.ceil(
                    filterAndSortProducts().length / itemsPerPage
                  ),
                }).map((_, index) => (
                  <button
                    key={index}
                    className={`p-2 ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } rounded flex items-center justify-center w-8 h-8 mr-2`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="bg-red-500 text-white p-2 rounded mt-4 w-full"
              onClick={() => {
                localStorage.removeItem("token");
                setLoggedIn(false);
                setProducts([]);
              }}
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
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Password:
              </label>
              <input
                type="password"
                className="mt-1 p-2 border rounded w-full"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                First Name:
              </label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                value={registrationFields.firstName}
                onChange={(e) =>
                  setRegistrationFields({
                    ...registrationFields,
                    firstName: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Last Name:
              </label>
              <input
                type="text"
                className="mt-1 p-2 border rounded w-full"
                value={registrationFields.lastName}
                onChange={(e) =>
                  setRegistrationFields({
                    ...registrationFields,
                    lastName: e.target.value,
                  })
                }
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              className="bg-blue-500 text-white p-2 rounded w-full"
              onClick={handleRegistration}
            >
              Register
            </button>
            <button
              className="bg-green-500 text-white p-2 rounded mt-2 w-full"
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
