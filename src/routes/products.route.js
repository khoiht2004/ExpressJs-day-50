const router = require("express").Router();
const controller = require("@/controllers/product.controller");
const { authRequired, validate, uploadCloud } = require("@/middlewares");
const { createProductSchema, updateProductSchema, deleteImageSchema } = require("@/validations/product.schema");

const createProductMiddlewares = [uploadCloud.single("imageUrl"), validate(createProductSchema)];
const updateProductMiddlewares = [uploadCloud.single("imageUrl"), validate(updateProductSchema)];

// Middlewares
router.use(authRequired);

// API
router.get("/", controller.getAllProducts);
router.post("/", createProductMiddlewares, controller.createProduct);
router.post("/gallery", uploadCloud.array("images", 5), controller.uploadGallery);
router.patch("/:id", updateProductMiddlewares, controller.updateProduct);

router.delete("/image", validate(deleteImageSchema, "query"), controller.deleteProductImage);
router.delete("/:id", controller.deleteProduct);


module.exports = router;
