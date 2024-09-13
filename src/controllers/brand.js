const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Brand:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the brand
 *         name:
 *           type: string
 *           description: The name of the brand
 *       example:
 *         id: 1
 *         name: "Nike"
 */

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: API for managing brands
 */

/**
 * @swagger
 * /brands/create:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the brand
 *                 example: "Adidas"
 *     responses:
 *       201:
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Brand name is required
 *       500:
 *         description: Failed to create brand
 */
const createBrand = async (req, res) => {
    try {
        const { name, slug } = req.body;

        if (!name) {
            res.status(400).json({ error: 'Brand name is required' });
            return;
        }

        const newBrand = await prisma.brands.create({
            data: {
                name, slug
            },
        });

        res.status(201).json({ message: 'Brand created successfully', brand: newBrand });
    } catch (error) {
        console.error("Create brand error:", error);
        res.status(500).json({ error: 'Failed to create brand' });
    }
};

/**
 * @swagger
 * /brands/all:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: A list of all brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brand'
 *       500:
 *         description: Failed to fetch brands
 */
const getBrands = async (req, res) => {
    try {
        const brands = await prisma.brands.findMany();
        res.status(200).json(brands);
    } catch (error) {
        console.error("Get brands error:", error);
        res.status(500).json({ error: 'Failed to fetch brands' });
    }
};

/**
 * @swagger
 * /brands/get/{id}:
 *   get:
 *     summary: Get a brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the brand
 *     responses:
 *       200:
 *         description: Brand retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Failed to fetch brand
 */
const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await prisma.brands.findUnique({
            where: { id: Number(id) },
        });

        if (!brand) {
            res.status(404).json({ error: 'Brand not found' });
            return;
        }

        res.status(200).json(brand);
    } catch (error) {
        console.error("Get brand by ID error:", error);
        res.status(500).json({ error: 'Failed to fetch brand' });
    }
};

/**
 * @swagger
 * /brands/update/{id}:
 *   put:
 *     summary: Update a brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the brand to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the brand
 *                 example: "Puma"
 *     responses:
 *       200:
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Failed to update brand
 */
const updateBrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug } = req.body;

        const brand = await prisma.brands.findUnique({
            where: { id: +id },
        });

        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        const updatedBrand = await prisma.brands.update({
            where: { id: Number(id) },
            data: { name, slug },
        });

        res.status(200).json({ message: 'Brand updated successfully', brand: updatedBrand });
    } catch (error) {
        console.error("Update brand error:", error);
        res.status(500).json({ error: 'Failed to update brand' });
    }
};

/**
 * @swagger
 * /brands/delete/{id}:
 *   delete:
 *     summary: Delete a brand by ID
 *     tags: [Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the brand to delete
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 *       404:
 *         description: Brand not found
 *       500:
 *         description: Failed to delete brand
 */
const deleteBrandById = async (req, res) => {
    try {
        const { id } = req.params;

        const brand = await prisma.brands.findUnique({
            where: { id: Number(id) },
        });

        if (!brand) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        await prisma.brands.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error("Delete brand error:", error);
        res.status(500).json({ error: 'Failed to delete brand' });
    }
};

module.exports = { createBrand, getBrands, getBrandById, updateBrandById, deleteBrandById };
