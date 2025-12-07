// Menu Items Table Component
import { useState } from "react";
import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import "../../../styles/components/admin/Menu/MenuItemsTable.css";

const MenuItemsTable = ({ items, onEdit, onDelete }) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="menu-items-table">
      <h2>Special menu all items</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input type="checkbox" />
              </th>
              <th>Item ID</th>
              <th>Product Name</th>
              <th>Size</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td>#{item.item_id}</td>
                <td>
                  <div className="product-info">
                    <strong>{item.product_name}</strong>
                    <p>{item.description}</p>
                  </div>
                </td>
                <td>{item.size}</td>
                <td>
                  <span className="category-badge">{item.category}</span>
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(item)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={`btn-delete ${
                        deleteConfirm === item.item_id ? "confirm" : ""
                      }`}
                      onClick={() => handleDelete(item.item_id)}
                      title={
                        deleteConfirm === item.item_id
                          ? "Click again to confirm"
                          : "Delete"
                      }
                    >
                      {deleteConfirm === item.item_id ? (
                        <FaExclamationTriangle />
                      ) : (
                        <FaTrash />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuItemsTable;
