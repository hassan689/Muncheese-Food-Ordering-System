// Menu Categories Component
import Card from "../../../components/ui/Card"
import "../../../styles/components/admin/Menu/MenuCategories.css"

const MenuCategories = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="menu-categories">
      <h2>Categories</h2>
      <div className="categories-grid">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card
              key={category.id}
              className={`category-card ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="category-icon">
                {typeof IconComponent === 'function' ? (
                  <IconComponent />
                ) : (
                  <span>{category.icon}</span>
                )}
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.count} items</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MenuCategories;
