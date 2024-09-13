const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Product Name"
 *         description:
 *           type: string
 *           example: "This is a sample product description."
 *         discount:
 *           type: integer
 *           example: 10
 *         price:
 *           type: number
 *           format: float
 *           example: 99.99
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             example: "https://example.com/image1.jpg"
 *         categoryId:
 *           type: integer
 *           example: 2
 *         userId:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         subcategoryId:
 *           type: integer
 *           example: 4
 *         brandId:
 *           type: integer
 *           example: 5
 *         colorId:
 *           type: integer
 *           nullable: true
 *           example: 6
 *         sizeId:
 *           type: integer
 *           nullable: true
 *           example: 7
 *         createdTime:
 *           type: string
 *           format: date-time
 *           example: "2024-08-31T12:00:00Z"
 *         updatedTime:
 *           type: string
 *           format: date-time
 *           example: "2024-08-31T12:30:00Z"
 *       required:
 *         - name
 *         - description
 *         - price
 *         - categoryId
 *         - subcategoryId
 *         - brandId
 *         - createdTime
 *         - updatedTime
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was created successfully
 *       500:
 *         description: Failed to create product
 */
const createProduct = async (req, res) => {
    try {
        const newProduct = await prisma.product.create({
            data: {
                name: req.body.name,
                description: req.body.description,
                price: parseFloat(req.body.price), // Ensure price is a float
                discount: parseInt(req.body.discount, 10), // Ensure discount is an integer
                images: req.body.images, // Assuming this is an array of strings
                categoryId: parseInt(req.body.categoryId, 10), // Ensure categoryId is an integer
                subcategoryId: req.body.subcategoryId ? parseInt(req.body.subcategoryId, 10) : null, // Optional
                brandsId: parseInt(req.body.brandsId, 10), // Ensure brandsId is an integer
                Colors: req.body.colors, // This should be a valid eColors enum value
                Size: req.body.size, // This should be a valid eSize enum value
            },
        });
        res.status(201).json({ message: "Succses", newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};


/**
 * @swagger
 * /products/all:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of products per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order of sorting
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: subcategoryId
 *         schema:
 *           type: integer
 *         description: Filter by subcategory ID
 *       - in: query
 *         name: brandId
 *         schema:
 *           type: integer
 *         description: Filter by brand ID
 *       - in: query
 *         name: colorId
 *         schema:
 *           type: integer
 *         description: Filter by color ID
 *       - in: query
 *         name: sizeId
 *         schema:
 *           type: integer
 *         description: Filter by size ID
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: discount
 *         schema:
 *           type: boolean
 *         description: Filter by products with discounts
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalProducts:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *       500:
 *         description: Failed to fetch products
 */
const getProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'price',
            sortOrder = 'asc',
            categoryId,
            subcategoryId,
            brandId,
            color,
            size,
            minPrice,
            maxPrice,
            discount
        } = req.query;

        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;

        const orderBy = {
            [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc'
        };

        const where = {};

        if (categoryId) where.categoryId = parseInt(categoryId, 10);
        if (subcategoryId) where.subcategoryId = parseInt(subcategoryId, 10);
        if (brandId) where.brandsId = parseInt(brandId, 10);

        if (color) {
            const colorsArray = color.split(',').map(c => c.trim().toUpperCase());
            where.Colors = { hasSome: colorsArray };
        }

        if (size) {
            const sizeArray = size.split(',').map(s => s.trim().toUpperCase());
            where.Size = { hasSome: sizeArray };
        }

        if (minPrice && maxPrice) where.price = { gte: parseFloat(minPrice), lte: parseFloat(maxPrice) };
        else if (minPrice) where.price = { gte: parseFloat(minPrice) };
        else if (maxPrice) where.price = { lte: parseFloat(maxPrice) };

        if (discount === 'true') where.discount = { gt: 0 };
        else if (discount === 'false') where.discount = 0;

        const products = await prisma.product.findMany({
            where,
            orderBy,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            include: {
                category: true,
                subcategory: true,
                Brands: true,
            }
        });

        const totalProducts = await prisma.product.count({ where });

        res.status(200).json({
            data: products,
            meta: {
                totalProducts,
                totalPages: Math.ceil(totalProducts / pageSize),
                currentPage: pageNumber,
                pageSize
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};


/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to retrieve
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to fetch product
 */
const getProductById = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(req.params.id) },
            include: {
                category: true,
                subcategory: true,
                Brands: true,
            }
        });
        if (product) res.status(200).json(product);
        else res.status(404).json({ error: 'Product not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to delete
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to delete product
 */
const deleteProductById = async (req, res) => {
    try {
        await prisma.product.delete({
            where: { id: Number(req.params.id) }
        });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Product not found' });
        } else {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }
};

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search for products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query string
 *     responses:
 *       200:
 *         description: A list of matching products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Failed to search products
 */
const searchProduct = async (req, res) => {
    try {
        const query = req.query.q;

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { category: { name: { contains: query, mode: 'insensitive' } } },
                    { subcategory: { name: { contains: query, mode: 'insensitive' } } }
                ]
            },
            include: {
                category: true,
                subcategory: true,
                Brands: true,
                Colors: true,
                Size: true,
                User: true
            }
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to search products' });
    }
};


/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: integer
 *               SubcategoryId:
 *                 type: integer
 *               brandsId:
 *                 type: integer
 *               colorsId:
 *                 type: integer
 *               sizeId:
 *                 type: integer
 *               discount:
 *                 type: number
 *             example:
 *               name: "Updated Product Name"
 *               description: "Updated description"
 *               price: 99.99
 *               categoryId: 1
 *               SubcategoryId: 2
 *               brandsId: 3
 *               colorsId: 4
 *               sizeId: 5
 *               discount: 10
 *     responses:
 *       200:
 *         description: The updated product data
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to update product
 */
const editProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.body)
        const updatedProduct = await prisma.product.update({
            where: {
                id: parseInt(id) 
            },
            data: {
                name: req.body.name,
                description: req.body.description,
                price: +req.body.price,
                discount: +req.body.discount,
                images: req.body.images,
                category: {
                    connect: { id: req.body.categoryId }
                },
                subcategory: {
                    connect: { id: req.body.subcategoryId }
                },
                Brands: {
                    connect: { id: req.body.brandsId }
                },
                Colors: {
                    set: req.body.colors
                },
                Size: {
                    set: req.body.size
                },
            }
        });
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update product' });
    }

};

/**
 * @swagger
 * /products/category/{categoryId}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category
 *     responses:
 *       200:
 *         description: A list of products in the specified category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                   subcategory:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       400:
 *         description: Invalid category ID
 *       500:
 *         description: Failed to fetch products by category
 */
const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = Number(req.params.categoryId);

        if (isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const products = await prisma.product.findMany({
            where: {
                categoryId: categoryId
            },
            include: {
                category: true,
                subcategory: true,
                Brands: true,
                Colors: true,
                Size: true,
                User: true
            }
        });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
};

/**
 * @swagger
 * /products/subcategory/{subcategoryId}:
 *   get:
 *     summary: Get products by subcategory ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: subcategoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the subcategory
 *     responses:
 *       200:
 *         description: List of products in the specified subcategory
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Failed to retrieve products
 */
const getProductsBySubcategory = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const products = await prisma.product.findMany({
            where: {
                subcategoryId: Number(subcategoryId),
            },
            include: {
                category: true,
                subcategory: true,
                Brands: true,
                Colors: true,
                Size: true,
                User: true
            },
        });

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found in this subcategory' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    getProductsByCategory,
    getProductsBySubcategory,
    deleteProductById,
    searchProduct,
    editProduct
};
