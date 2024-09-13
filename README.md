Here's the updated API documentation including the new endpoint for deleting a cart item:

---

**eCommerce API Documentation for Frontend Developers**

This backend API provides routes for **User Authentication**, **Products**, **Categories**, **Subcategories**, **Brands**, and **Cart Management**. Below is a detailed description of each available endpoint, HTTP methods, example requests, and instructions.

## **Base URL**

```
<https://ecommerse.davidhtml.xyz>

```

### **Headers**

For routes that require authentication, include a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>

```

---

## **User Authentication Routes**

| HTTP Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| **POST** | `/register` | Register a new user | No |
| **POST** | `/login` | Login a user | No |
| **POST** | `/cart/add` | Add product to cart | Yes |
| **DELETE** | `/cart/delete/:itemId` | Remove product from cart | Yes |

### **Example Request: Register**

```jsx
axios.post('/register', {
    name: "John Doe",
    username: "johndoe",
    phone: "+1234567890",
    address: "123 Main St, Anytown, USA",
    dob: "1990-01-01",
    gender: "male",
    email: "johndoe@example.com",
    password: "securepassword"
});

```

### **Example Request: Login**

```jsx
axios.post('/login', {
    email: "john@example.com",
    password: "password123"
});

```

### **Example Request: Add to Cart**

```jsx
axios.post('/cart/add', {
    productId: 1,  // Product ID
    quantity: 2    // mehsulun sayi defauld olaraq 1dir 
}, {
    headers: {
        Authorization: 'Bearer <JWT_TOKEN>'
    }
});

```

### **Example Request: Delete from Cart**

```jsx
axios.delete('/cart/delete/1', {
    headers: {
        Authorization: 'Bearer <JWT_TOKEN>'
    }
});

```

---

## **Product Routes**

| HTTP Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| **POST** | `/products/create` | Create a new product | Yes |
| **GET** | `/products/all` | Get a list of all products | No |
| **GET** | `/products/get/:id` | Get a specific product by ID | No |
| **PUT** | `/products/update/:id` | Update a specific product by ID | Yes |
| **DELETE** | `/products/delete/:id` | Delete a product by ID | Yes |
| **GET** | `/products/search` | Search for products | No |
| **GET** | `/products/category/:categoryid` | Get products by category | No |
| **GET** | `/products/subcategory/:subcategoryid` | Get products by subcategory | No |

### **Example Request: Get Products with Filters and Sorting**

```jsx
axios.get('/products/search', {
    params: {
        page: 2,              // Paginate to the second page default (1)
        limit: 5,             // Limit results to 5 products per page default 10
        sortBy: 'price',      // Sort products by price
        sortOrder: 'asc',     // Sort in ascending order
        categoryId: 1,        // Filter by category ID
        brandId: 2,           // Filter by brand ID
        color: ['red'],       // Filter by color ID
        size: ['XXL', 'L'],   // Filter by size ID
        minPrice: 50,         // Minimum price
        maxPrice: 500,        // Maximum price
        discount: true        // Filter to show products with discounts
    }
})
.then(response => {
    console.log(response.data);
})
.catch(error => {
    console.error('Error fetching filtered products:', error);
});

```

**Example URL**:

```
https://ecommerse.davidhtml.xyz/products/search?page=2&limit=5&sortBy=price&sortOrder=asc&categoryId=1&brandId=2&color=RED,BLUE&size=XXL,L&minPrice=50&maxPrice=500&discount=true
```

---

## **Category Routes**

| HTTP Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| **POST** | `/categories/create` | Create a new category | Yes |
| **GET** | `/categories/all` | Get a list of all categories | No |
| **GET** | `/categories/get/:id` | Get a specific category by ID | No |
| **PUT** | `/categories/update/:id` | Update a specific category by ID | Yes |
| **DELETE** | `/categories/delete/:id` | Delete a category by ID | Yes |

### **Example Request: Create Category**

```jsx
axios.post('/categories/create', {
    name: "Category Name",
    slug: "category_name"
    
}, {
    headers: {
        Authorization: 'Bearer <JWT_TOKEN>'
    }
});

```

---

## **Subcategory Routes**

| HTTP Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| **POST** | `/categories/subcategory/create` | Create a subcategory | Yes |
| **PUT** | `/categories/subcategory/update/:id` | Update a subcategory by ID | Yes |
| **DELETE** | `/categories/subcategory/delete/:id` | Delete a subcategory by ID | Yes |

### **Example Request: Create Subcategory**

```jsx
axios.post('/categories/subcategory/create', {
    name: "Subcategory Name",
    slug: "subcategory_name"
    categoryId: 1
}, {
    headers: {
        Authorization: 'Bearer <JWT_TOKEN>'
    }
});

```

---

## **Brand Routes**

| HTTP Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| **POST** | `/brands/create` | Create a new brand | Yes |
| **GET** | `/brands/all` | Get a list of all brands | No |
| **GET** | `/brands/get/:id` | Get a specific brand by ID | No |
| **PUT** | `/brands/update/:id` | Update a specific brand by ID | Yes |
| **DELETE** | `/brands/delete/:id` | Delete a brand by ID | Yes |

### **Example Request: Create Brand**

```jsx
axios.post('/brands/create', {
    name: "Brand Name"
}, {
    headers: {
        Authorization: 'Bearer <JWT_TOKEN>'
    }
});

```

---

## **File Upload Routes**

| HTTP Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| **POST** | `/img/upload` | Upload an image file | Yes |
| **DELETE** | `/img/delete/:filename` | Delete a file by filename | Yes |

### **Example Request: File Upload**

```jsx
const formData = new FormData();
formData.append('file', file);

axios.post('/img/upload', formData, {
    headers: {
        Authorization: 'Bearer <JWT_TOKEN>',
        'Content-Type': 'multipart/form-data'
    }
});

```

---

This documentation should help frontend developers integrate with the API effectively.