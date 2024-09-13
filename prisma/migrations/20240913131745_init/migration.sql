-- CreateEnum
CREATE TYPE "eUser" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "eGender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'GAY', 'TRANS');

-- CreateEnum
CREATE TYPE "eColors" AS ENUM ('RED', 'GREEN', 'BLUE', 'YELLOW', 'BLACK', 'WHITE', 'ORANGE', 'PURPLE', 'INDIGO', 'VIOLET');

-- CreateEnum
CREATE TYPE "eSize" AS ENUM ('L', 'M', 'S', 'XL', 'XXL');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user_img" TEXT DEFAULT 'https://i.pinimg.com/originals/1f/28/c6/1f28c68d2c35f389966b5a363b992d06.png',
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "dob" TIMESTAMP(3),
    "gender" "eGender" NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "eUser" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "images" TEXT[],
    "categoryId" INTEGER NOT NULL,
    "subcategoryId" INTEGER,
    "brandsId" INTEGER NOT NULL,
    "Colors" "eColors"[] DEFAULT ARRAY[]::"eColors"[],
    "Size" "eSize"[] DEFAULT ARRAY[]::"eSize"[],
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_phone_email_key" ON "User"("username", "phone", "email");

-- CreateIndex
CREATE INDEX "Product_name_description_idx" ON "Product"("name", "description");

-- CreateIndex
CREATE UNIQUE INDEX "Brands_name_slug_key" ON "Brands"("name", "slug");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Subcategory_name_idx" ON "Subcategory"("name");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandsId_fkey" FOREIGN KEY ("brandsId") REFERENCES "Brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
