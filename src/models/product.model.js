const prisma = require("@/libs/prisma");

const getAllProducts = async () => {
  return await prisma.product.findMany();
};

const createProduct = async ({
  name,
  description,
  price,
  stock,
  imageUrl,
  userId,
}) => {
  return await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      imageUrl,
      userId,
    },
  });
};

const uploadGallery = async (images) => {
  console.log(images);
  return;
};

const updateProduct = async (id, data) => {
  return await prisma.product.update({ where: { id: Number(id) }, data });
};

const deleteProductImage = async (id) => {
  return await prisma.product.update({
    where: { id: Number(id) },
    data: { imageUrl: null },
  });
};

const deleteProduct = async (id) => {
  return await prisma.product.delete({ where: { id: Number(id) } });
};

module.exports = {
  getAllProducts,
  createProduct,
  uploadGallery,
  updateProduct,
  deleteProductImage,
  deleteProduct,
};
