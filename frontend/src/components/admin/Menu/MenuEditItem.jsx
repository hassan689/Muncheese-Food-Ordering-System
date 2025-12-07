// Edit Product / Item Modal
import { useState, useEffect } from "react";
import "../../../styles/components/admin/Menu/MenuAddItem.css";

export default function MenuEditItem({ isOpen, onClose, item, onEdit }) {
  if (!isOpen) return null;

  console.log(item);
  const [formData, setFormData] = useState({
    product_name: item?.product_name || "",
    price: item?.price || "",
  });

  useEffect(() => {
    if (item) {
      setFormData({
        product_name: item.product_name || "",
        price: item.price || "",
      });
    }
  }, [item]);

  const handleSubmit = async () => {
    const payload = {
      product_name: formData.product_name,
      price: Number(formData.price),
    };

    onEdit(payload);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Item</h2>
          <button className="modal-close" onClick={onClose}>
            x
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={formData.product_name}
              onChange={(e) =>
                setFormData({ ...formData, product_name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Category (Not Editable)</label>
            <input type="text" value={item?.category || ""} disabled style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }} />
          </div>

          <div className="form-group">
            <label>Description (Not Editable)</label>
            <textarea rows="2" value={item?.description || ""} disabled style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }} />
          </div>

          <div className="form-group">
            <label>Size (Not Editable)</label>
            <input type="text" value={item?.size || "Standard"} disabled style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }} />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
            />
          </div>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSubmit}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
