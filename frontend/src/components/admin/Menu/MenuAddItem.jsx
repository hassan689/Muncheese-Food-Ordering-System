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

  const [imageFiles, setImageFiles] = useState({
    file: null,
    file_small: null,
    file_medium: null,
    file_large: null,
  });


  const handleImageChange = (e, fileKey) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles(prev => ({ ...prev, [fileKey]: file }));
    }
  };

  const handleSubmit = async () => {
    // Create FormData for file upload
    const formDataToSend = new FormData();
    
    formDataToSend.append('product_name', formData.product_name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('has_sizes', formData.has_sizes.toString());

    // Add image files
    if (formData.has_sizes) {
      // For items with sizes, add size-specific images or single image
      if (imageFiles.file) {
        formDataToSend.append('file', imageFiles.file);
      } else {
        if (imageFiles.file_small) formDataToSend.append('file_small', imageFiles.file_small);
        if (imageFiles.file_medium) formDataToSend.append('file_medium', imageFiles.file_medium);
        if (imageFiles.file_large) formDataToSend.append('file_large', imageFiles.file_large);
      }
      
      formDataToSend.append('price_small', formData.prices.Small);
      formDataToSend.append('price_medium', formData.prices.Medium);
      formDataToSend.append('price_large', formData.prices.Large);
    } else {
      // For single item, add single image
      if (imageFiles.file) {
        formDataToSend.append('file', imageFiles.file);
      }
      formDataToSend.append('price', formData.price);
    }

    // Call onSave with FormData
    await onSave(formDataToSend);
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

          {/* Image Upload Section */}
          <div className="form-group">
            <label>Product Image{formData.has_sizes ? ' (Optional - upload one for all sizes or separate for each)' : ''}</label>
            {formData.has_sizes ? (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>Single Image (for all sizes):</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'file')}
                    style={{ width: '100%', padding: '8px' }}
                  />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>Or upload separate images:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Small:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'file_small')}
                        style={{ width: '100%', padding: '6px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Medium:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'file_medium')}
                        style={{ width: '100%', padding: '6px', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Large:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, 'file_large')}
                        style={{ width: '100%', padding: '6px', fontSize: '12px' }}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'file')}
                style={{ width: '100%', padding: '8px' }}
              />
            )}
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
