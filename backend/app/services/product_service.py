# services/product_service.py
from app.repositories.product_repository import ProductRepository
from app.utils.cloudinary_utils import upload_image_to_cloudinary

class ProductService:
    @staticmethod
    def get_all_items():
        """Get all product items"""
        return ProductRepository.get_all_items()

    @staticmethod
    def get_item_by_id(item_id):
        """Get a product item by ID"""
        return ProductRepository.get_item_by_id(item_id)

    @staticmethod
    def create_item(data):
        """Create a new product item - handles image uploads automatically"""
        files = data.pop('files', {})
        
        # Upload images if files are provided
        if files:
            category = data.get('category', 'products').lower()
            folder = f"products/{category}"
            
            # For single file (no sizes)
            if 'file' in files:
                upload_result = upload_image_to_cloudinary(files['file'], folder=folder)
                if upload_result.get('success'):
                    data['image_url'] = upload_result.get('url')
                else:
                    raise ValueError(f"Image upload failed: {upload_result.get('error')}")
            # For multiple files (with sizes)
            elif 'file_small' in files or 'file_medium' in files or 'file_large' in files:
                image_urls = {}
                sizes = ['Small', 'Medium', 'Large']
                file_keys = ['file_small', 'file_medium', 'file_large']
                
                for size, file_key in zip(sizes, file_keys):
                    if file_key in files:
                        public_id = f"{data.get('product_name', 'item').lower().replace(' ', '-')}-{size.lower()}"
                        upload_result = upload_image_to_cloudinary(
                            files[file_key], 
                            folder=folder,
                            public_id=public_id
                        )
                        if upload_result.get('success'):
                            image_urls[size] = upload_result.get('url')
                        else:
                            raise ValueError(f"Image upload failed for {size}: {upload_result.get('error')}")
                
                if image_urls:
                    data['image_urls'] = image_urls
        
        return ProductRepository.create_item(data)

    @staticmethod
    def update_item(item_id, data):
        """Update a product item - only allows product_name and price to be edited"""
        item = ProductRepository.get_item_by_id(item_id)
        if not item:
            return None
        
        # Only allow product_name and price to be updated
        allowed_fields = ['product_name', 'price']
        filtered_data = {k: v for k, v in data.items() if k in allowed_fields}
        
        return ProductRepository.update_item(item, filtered_data)

    @staticmethod
    def delete_item(item_id):
        """Delete a product item"""
        item = ProductRepository.get_item_by_id(item_id)
        if not item:
            return False
        ProductRepository.delete_item(item)
        return True

    @staticmethod
    def create_product_with_items(data):
        """Create a product with all its items - handles image uploads automatically"""
        files = data.pop('files', {})
        
        # Upload images if files are provided
        if files:
            category = data.get('category', 'products').lower()
            folder = f"products/{category}"
            product_name = data.get('product_name', 'product').lower().replace(' ', '-')
            
            has_sizes = data.get('has_sizes', False)
            
            if has_sizes:
                # Upload 3 images for Small, Medium, Large
                image_urls = {}
                sizes = ['Small', 'Medium', 'Large']
                file_keys = ['file_small', 'file_medium', 'file_large']
                
                # Check if single file is provided for all sizes
                if 'file' in files and not any(fk in files for fk in file_keys):
                    # Use single file for all sizes
                    public_id = f"{product_name}"
                    upload_result = upload_image_to_cloudinary(
                        files['file'], 
                        folder=folder,
                        public_id=public_id
                    )
                    if upload_result.get('success'):
                        url = upload_result.get('url')
                        image_urls = {'Small': url, 'Medium': url, 'Large': url}
                    else:
                        raise ValueError(f"Image upload failed: {upload_result.get('error')}")
                else:
                    # Upload separate files for each size
                    for size, file_key in zip(sizes, file_keys):
                        if file_key in files:
                            public_id = f"{product_name}-{size.lower()}"
                            upload_result = upload_image_to_cloudinary(
                                files[file_key], 
                                folder=folder,
                                public_id=public_id
                            )
                            if upload_result.get('success'):
                                image_urls[size] = upload_result.get('url')
                            else:
                                raise ValueError(f"Image upload failed for {size}: {upload_result.get('error')}")
                
                if image_urls:
                    data['image_urls'] = image_urls
            else:
                # Single image for product without sizes
                if 'file' in files:
                    public_id = product_name
                    upload_result = upload_image_to_cloudinary(
                        files['file'], 
                        folder=folder,
                        public_id=public_id
                    )
                    if upload_result.get('success'):
                        data['image_url'] = upload_result.get('url')
                    else:
                        raise ValueError(f"Image upload failed: {upload_result.get('error')}")
        
        return ProductRepository.create_product_with_items(data)

    @staticmethod
    def get_items_by_category(category):
        """Get all product items filtered by category"""
        return ProductRepository.get_items_by_category(category)

    @staticmethod
    def get_products_by_category(category):
        """Get all products filtered by category"""
        return ProductRepository.get_products_by_category(category)

    @staticmethod
    def get_all_categories():
        """Get all unique categories"""
        return ProductRepository.get_all_categories()

    @staticmethod
    def get_popular_items(limit=4):
        """Get popular items for landing page"""
        return ProductRepository.get_popular_items(limit)

