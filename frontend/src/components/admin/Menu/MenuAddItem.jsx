// Add Product / Item Modal
import { useState } from "react";
import "../../../styles/components/admin/Menu/MenuAddItem.css";

export default function MenuAddItem({ isOpen, onClose, onSave}) {
  if (!isOpen) return null;
  
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    category: "",
    has_sizes: false,
    price: "",
    prices: {
      Small: "",
      Medium: "",
      Large: "",
    },
  });


  const handleSubmit = () => {
    const payload = formData.has_sizes
      ? {
          product_name: formData.product_name,
          description: formData.description,
          category: formData.category,
          has_sizes: true,
          prices: {
            Small: Number(formData.prices.Small),
            Medium: Number(formData.prices.Medium),
            Large: Number(formData.prices.Large),
          },
        }
      : {
          product_name: formData.product_name,
          description: formData.description,
          category: formData.category,
          has_sizes: false,
          price: Number(formData.price),
        };

    onSave(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Product</h2>
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
            <label>Select Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              <option value="Pizza">Pizza</option>
              <option value="Burger">Burger</option>
              <option value="Fries">Fries</option>
              <option value="Drinks">Drinks</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Has Sizes?</label>
            <select
              value={formData.has_sizes ? "yes" : "no"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  has_sizes: e.target.value === "yes",
                })
              }
            >
              <option value="no">No (Single Price)</option>
              <option value="yes">Yes (Small/Medium/Large)</option>
            </select>
          </div>

          {formData.has_sizes ? (
            <>
              <div className="form-group">
                <label>Small Price</label>
                <input
                  type="number"
                  value={formData.prices.Small}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prices: { ...formData.prices, Small: e.target.value },
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Medium Price</label>
                <input
                  type="number"
                  value={formData.prices.Medium}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prices: { ...formData.prices, Medium: e.target.value },
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Large Price</label>
                <input
                  type="number"
                  value={formData.prices.Large}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prices: { ...formData.prices, Large: e.target.value },
                    })
                  }
                />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Price (Single Item)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </div>
          )}

          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-save" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
