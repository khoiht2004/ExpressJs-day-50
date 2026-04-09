const z = require("zod");

const createProductSchema = z.object({
      name: z.string({ required_error: "Name is required" })
            .min(2, "Name is too short")
            .max(100, "Name is too long"),
      price: z.coerce.number({ required_error: "Price is required", invalid_type_error: "Price must be a number" })
            .min(1, "Price must be greater than 0"),
      stock: z.coerce.number({ required_error: "Stock is required", invalid_type_error: "Stock must be a number" })
            .min(0, "Stock must be greater than or equal to 0"),
      description: z.string().max(500, "Description is too long").optional(),
});

const updateProductSchema = z.object({
      name: z.string().min(2, "Name is too short").max(100, "Name is too long").optional(),
      price: z.coerce.number().min(1, "Price must be greater than 0").optional(),
      stock: z.coerce.number().min(0, "Stock must be greater than or equal to 0").optional(),
      description: z.string().max(500, "Description is too long").optional(),
      imageUrl: z.string().optional(),
});

const deleteImageSchema = z.object({
      publicId: z.string({ required_error: "publicId is required" }).min(1, "publicId is required"),
});

module.exports = {
      createProductSchema,
      updateProductSchema,
      deleteImageSchema,
};
