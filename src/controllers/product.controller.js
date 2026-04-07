const model = require("@/models/product.model");
const { cloudinaryConfig } = require("@/config");

const getAllProducts = async (req, res) => {
  const products = await model.getAllProducts();
  return res.success(200, products);
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const userId = req.auth?.user.id;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = req.file.path.replace(/\\/g, "/");
    }

    if (!imageUrl) return res.error(400, "Image product is required");

    const product = await model.createProduct({
      name,
      description,
      price,
      stock,
      imageUrl,
      userId,
    });
    return res.success(201, product);
  } catch (error) {
    console.error("Lỗi khi tạo product:", error);
    if (typeof res.error === "function") {
      return res.error(500, error.message || "Internal Server Error");
    }
    return res.status(500).json({ error: error.message });
  }
};

const uploadGallery = async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.error(400, "Vui lòng chọn ít nhất 1 ảnh");
    }

    return res.success(200, {
      message: `Upload thành công ${files.length} ảnh`,
      urls: files.map((f) => f.path.replace(/\\/g, "/")),
    });
  } catch (error) {
    if (typeof res.error === "function") {
      return res.error(500, error.message);
    }
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (req.file) {
      data.imageUrl = req.file.path.replace(/\\/g, "/");
    }

    try {
      const product = await model.updateProduct(id, data);
      return res.success(200, {
        message: "Cập nhật thành công",
        data: product,
      });
    } catch (e) {
      // P2025 là mã lỗi của Prisma khi ko tìm thấy record
      if (e.code === "P2025") {
        return res.error(404, "Không tìm thấy sản phẩm");
      }
      throw e;
    }  
  } catch (error) {
    return res.error(500, error.message);
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const { publicId } = req.query;
    const result = await cloudinaryConfig.uploader.destroy(publicId);

    if (result.result === "ok") {
      return res.status(200).json({ message: "Xoá ảnh thành công" });
    } else {
      return res.status(400).json({ message: "Không tìm thấy ảnh hoặc publicId không hợp lệ" });
    }
  } catch (error) {
    if (typeof res.error === "function") {
      return res.error(500, error.message);
    }
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await model.deleteProduct(id);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    if (typeof res.error === "function") {
      return res.error(500, error.message);
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  uploadGallery,
  deleteProductImage,
  deleteProduct,
};
