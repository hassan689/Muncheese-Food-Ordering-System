import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/admin/Layout";
import MenuCategories from "../../components/admin/Menu/MenuCategories";
import MenuItemsTable from "../../components/admin/Menu/MenuItemsTable";
import MenuAddItem from "../../components/admin/Menu/MenuAddItem";
import MenuEditItem from "../../components/admin/Menu/MenuEditItem";
import "../../styles/pages/admin/Menu.css";

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");        // This state is responsible for re-rendering when category changes in MenuCetegories
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);            // This state is responsible for re-rendering when additem menu is displayed
  const [menuItems, setMenuItems] = useState([])                          // This state is responsible for re-rendering when menuitems is changed (either edited or deleted)
  const [editingItem, setEditingItem] = useState(null);                   // This state is responsible for re-rendering when editingItem is set to item_id
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);          // This state is responsible for re-rendering when edititem menu is displayed
  const [categories, setCategories] = useState([]);                       // This state is responsible for re-rendering when menuItems changes in categories

  // This function runs once for the first time and loads all items
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/items");
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        setMenuItems(data); // Update state with API response
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []); // Empty dependency array ensures it runs once on mount

  // This function runs once for the first time and loads all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();

        // Add 'All' category manually
        const allCategory = { id: "all", name: "All", icon: "🍽️", count: menuItems.length };

        // Map fetched categories to include count and optional icons
        const fetchedCategories = data['categories'].map((cat) => ({
          id: cat,
          name: cat,
          icon:
            cat === "Pizza"
              ? "🍕"
              : cat === "Burger"
              ? "🍔"
              : cat === "Fries"
              ? "🍟"
              : cat === "Desserts"
              ? "🍰"
              : cat === "Drinks"
              ? "🥤"
              : "🍽️", // default icon
          count: menuItems.filter((i) => i.category === cat).length,
        }));

        setCategories([allCategory, ...fetchedCategories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [menuItems]); // Re-run if menuItems changes to update counts


  // Filtered Item List passed to MenuItemsTable, changed when selectedCategory is called in MenuCategories
  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  // Function passed to MenuItemsTable, called when item edit button is clicked
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  // Function passed to MenuItemsTable, called when item delete button clicked
  // This triggers re-rendering (as it changed menu items deleted a menu item)
  const handleDelete = async (item_id) => {
    // Saving Product in database
    try {
      const response = await fetch(`http://localhost:5000/api/products/items/${item_id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Product Deleted:", data);
      // Updating on frontend (envokes re-render)
      setMenuItems(menuItems.filter((item) => item.item_id !== item_id));
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  // Passed to MenuAddItem so that when saving data it is being called
  const handleSaveItem = async (formData) => {
    // Saving Product in database
    try {
      const response = await fetch("http://localhost:5000/api/products/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response}`);
      }

      const data = await response.json();
      console.log("Product added:", data);
      // Updating on frontend (envokes re-render)
      setMenuItems([...menuItems, ...data.items]); // Make it Re-render
      
      // Updating UI
      // setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  // Passed to MenuEditItem so that when item is updated new post request can be made
  const handleEditItem = async (formData) => {
    // Saving Product in database
    try {
      const response = await fetch(`http://localhost:5000/api/products/items/${editingItem.item_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Product Edited:", data);

      // Update frontend
      setMenuItems(menuItems.map(item =>
        item.item_id === editingItem.item_id ? data : item
      ));

      // Reset editing state
      setEditingItem(null); // or whatever state you use to track editing
      setIsEditModalOpen(false); // if you have a modal open state
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <AdminLayout title="Menu">
      <div className="page-header">
        <div className="breadcrumb"></div>
        <button className="btn-add-item" onClick={() => setIsAddModalOpen(true)}>
          Add New Items
        </button>
      </div>

      <MenuCategories
        categories={categories} // categories passed as list of categories
        selectedCategory={selectedCategory} // selectedCategory passed as currenyly selected category id
        onCategorySelect={setSelectedCategory} // function passed that will trigger re-rendering if it changes the category
      />

      <MenuItemsTable
        items={filteredItems} // List of Items passed
        onEdit={handleEdit} // Triggered when edit button is clicked in items table
        onDelete={handleDelete} // Triggered when delete button is clicked twice in items table
      />

      <MenuAddItem
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveItem}
      />

      <MenuEditItem
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={editingItem}
        onEdit={handleEditItem}
      />
    </AdminLayout>
  );
};

export default MenuPage;
