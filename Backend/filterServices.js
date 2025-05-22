const ServiceCategory = require("./models/serviceCatageroy");

function extractServiceName(query) {
    // Remove location words like "in Kanpur", "near Delhi", etc.
    return query.replace(/\bin\s+[A-Z][a-z]+/g, "").trim();
}

async function filterServicesWithAI(query) {
    try {
        console.log("Original user query:", query);

        // Extract service name (removes location info)
        const cleanQuery = extractServiceName(query);
        console.log("Filtered query (without location):", cleanQuery);

        // Fetch the service category that contains a matching service title
        const serviceCategory = await ServiceCategory.findOne({ "services.title": { $regex: cleanQuery, $options: "i" } })
            .populate({
                path: "services.agents",
                select: "fullName", // Fetch only full names of service providers
            });

        if (!serviceCategory) {
            console.log("No matching services found.");
            return [];
        }

        // Extract the services that match the cleaned query
        const matchedServices = serviceCategory.services.filter(service =>
            service.title.toLowerCase().includes(cleanQuery.toLowerCase())
        );

        // Format the response to include provider names
        const response = matchedServices.map(service => ({
            serviceName: service.title,
            providerNames: service.agents.map(agent => agent.fullName), // Extract service provider names
        }));

        console.log("Filtered Services:", response);
        return response;
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}

module.exports = filterServicesWithAI;