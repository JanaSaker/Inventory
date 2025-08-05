import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/authContext';
import { toast } from 'react-toastify';


const API = axios.create({ baseURL: 'http://localhost:5000/api' });

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ name: '', category: '', status: '' });
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', category: '', quantity: '', status: '' });
  const { user } = useAuth();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get('/items');
      setItems(Array.isArray(res.data.data) ? res.data.data : res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    const updatedFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(updatedFilters);
    const fetchFilteredItems = async () => {
      try {
        const query = new URLSearchParams(updatedFilters).toString();
        const res = await API.get(`/items?${query}`);
        setItems(Array.isArray(res.data.data) ? res.data.data : res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchFilteredItems();
  };

const handleAISearch = async () => {
  if (!aiPrompt.trim()) return;
  try {
    setAiLoading(true);
    const res = await API.post(
      '/ai-search',
      { prompt: aiPrompt },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    const aiResult = res.data.data || res.data.items || res.data;
    setItems(Array.isArray(aiResult) ? aiResult : []);
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    if (err.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
    } else {
      toast.error(`AI search failed: ${errorMsg}`);
    }
  } finally {
    setAiLoading(false);
  }
};


const handleDelete = async (id) => {
  try {
    await API.delete(`/items/${id}`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    toast.success('Item deleted.');
    fetchItems();
  } catch (err) {
    if (err.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
    } else {
      toast.error(`Failed to delete item: ${err.response?.data?.message || err.message}`);
    }
  }
};


  const handleEdit = (item) => {
    setEditingItem(item);
  };

const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    await API.put(`/items/${editingItem.id}`, editingItem, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    toast.success('Item updated.');
    setEditingItem(null);
    fetchItems();
  } catch (err) {
    if (err.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
    } else {
      toast.error(`Failed to update item: ${err.response?.data?.message || err.message}`);
    }
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

const handleCreate = async (e) => {
  e.preventDefault();
  try {
    await API.post('/items', newItem, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    toast.success('Item added.');
    setNewItem({ name: '', category: '', quantity: '', status: '' });
    fetchItems();
  } catch (err) {
    if (err.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
    } else {
      toast.error(`Failed to add item: ${err.response?.data?.message || err.message}`);
    }
  }
};


  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold mb-6">Inventory</h2>

      {/* AI Search */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🧠 AI Smart Search</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="e.g. show me low stock accessories"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1 border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleAISearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {aiLoading ? 'Searching...' : 'Ask AI'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          className="border p-2 rounded w-full sm:w-auto"
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          className="border p-2 rounded w-full sm:w-auto"
          onChange={handleChange}
        />
        <select
          name="status"
          className="border p-2 rounded w-full sm:w-auto"
          onChange={handleChange}
        >
          <option value="">All statuses</option>
          <option value="in stock">In Stock</option>
          <option value="low stock">Low Stock</option>
          <option value="ordered">Ordered</option>
          <option value="discontinued">Discontinued</option>
        </select>
      </div>

      {/* Create Form */}
      {user?.role === 'admin' && (
        <form onSubmit={handleCreate} className="mb-6 p-4 border rounded bg-blue-50">
          <h3 className="font-semibold mb-2">Add New Item</h3>
          <input
            type="text"
            name="name"
            value={newItem.name}
            onChange={handleNewInputChange}
            className="border p-2 rounded mb-2 w-full"
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="category"
            value={newItem.category}
            onChange={handleNewInputChange}
            className="border p-2 rounded mb-2 w-full"
            placeholder="Category"
            required
          />
          <input
            type="number"
            name="quantity"
            value={newItem.quantity}
            onChange={handleNewInputChange}
            className="border p-2 rounded mb-2 w-full"
            placeholder="Quantity"
            required
          />
          <select
            name="status"
            value={newItem.status}
            onChange={handleNewInputChange}
            className="border p-2 rounded mb-2 w-full"
            required
          >
            <option value="">Select Status</option>
            <option value="in stock">In Stock</option>
            <option value="low stock">Low Stock</option>
            <option value="ordered">Ordered</option>
            <option value="discontinued">Discontinued</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Item
          </button>
        </form>
      )}

      {/* Update Form */}
      {editingItem && (
        <form onSubmit={handleUpdate} className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Edit Item</h3>
          <input
            type="text"
            name="name"
            value={editingItem.name}
            onChange={handleInputChange}
            className="border p-2 rounded mb-2 w-full"
            placeholder="Name"
          />
          <input
            type="text"
            name="category"
            value={editingItem.category}
            onChange={handleInputChange}
            className="border p-2 rounded mb-2 w-full"
            placeholder="Category"
          />
          <input
            type="number"
            name="quantity"
            value={editingItem.quantity}
            onChange={handleInputChange}
            className="border p-2 rounded mb-2 w-full"
            placeholder="Quantity"
          />
          <select
            name="status"
            value={editingItem.status}
            onChange={handleInputChange}
            className="border p-2 rounded mb-2 w-full"
          >
            <option value="in stock">In Stock</option>
            <option value="low stock">Low Stock</option>
            <option value="ordered">Ordered</option>
            <option value="discontinued">Discontinued</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Update Item
          </button>
        </form>
      )}

      {/* Loader / Results */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-red-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow-md bg-white transition transform hover:-translate-y-1 hover:shadow-lg"
            >
              {item.image && (
                <img
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-700">Category: {item.category}</p>
              <p className="text-sm text-gray-700">Quantity: {item.quantity}</p>
              <p
                className={`text-sm font-medium ${
                  item.status === 'low stock'
                    ? 'text-red-500'
                    : item.status === 'discontinued'
                    ? 'text-gray-500'
                    : 'text-green-600'
                }`}
              >
                Status: {item.status}
              </p>
              {user?.role === 'admin' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
