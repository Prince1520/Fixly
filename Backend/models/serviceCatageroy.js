const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true }, // Ensure Number type for price
    agents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    serviceCatagory: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory", required: true },
});

// Instead of embedding the whole schema, use Schema reference
const ServiceCategorySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        services: [{ type: ServiceSchema }],
        featuredServices: [{ type: ServiceSchema }],
        homeServices: [{ type: ServiceSchema }],
    },
    { timestamps: true }
);

module.exports = mongoose.model("ServiceCategory", ServiceCategorySchema);
