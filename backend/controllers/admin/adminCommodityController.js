const { responseReturn } = require('../../utiles/response');
const commodityModel = require('../../models/commodityModel');
const sellerModel = require('../../models/sellerModel');
const buyerModel = require('../../models/buyerModel');
const orderModel = require('../../models/customerOrder');
const XLSX = require('xlsx');

class adminCommodityController {
    // Get all commodities with pagination
    get_all_commodities = async (req, res) => {
        try {
            const { page = 1, parPage = 10, searchValue = '' } = req.query;
            const skip = (page - 1) * parPage;
            
            let query = {};
            if (searchValue) {
                query = {
                    $or: [
                        { name: { $regex: searchValue, $options: 'i' } },
                        { category: { $regex: searchValue, $options: 'i' } }
                    ]
                };
            }

            const commodities = await commodityModel.find(query)
                .skip(skip)
                .limit(parPage)
                .sort({ createdAt: -1 });

            const totalCommodities = await commodityModel.countDocuments(query);

            responseReturn(res, 200, {
                commodities,
                totalCommodities,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCommodities / parPage)
            });
        } catch (error) {
            console.error('Error fetching commodities:', error);
            responseReturn(res, 500, { error: 'Failed to fetch commodities' });
        }
    };

    // Upload commodities from Excel
    upload_excel_commodities = async (req, res) => {
        try {
            if (!req.file) {
                return responseReturn(res, 400, { error: 'No file uploaded' });
            }

            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            let successCount = 0;
            let errorCount = 0;
            const errors = [];

            for (const row of data) {
                try {
                    const commodityData = {
                        name: row['Commodity Name'] || row['name'],
                        category: row['Category'] || row['category'],
                        unit: row['Unit'] || row['unit'],
                        description: row['Description'] || row['description'],
                        basePrice: parseFloat(row['Base Price'] || row['basePrice']) || 0
                    };

                    if (!commodityData.name) {
                        errors.push(`Row ${successCount + errorCount + 1}: Missing commodity name`);
                        errorCount++;
                        continue;
                    }

                    // Check if commodity already exists
                    const existingCommodity = await commodityModel.findOne({ name: commodityData.name });
                    if (existingCommodity) {
                        errors.push(`Row ${successCount + errorCount + 1}: Commodity "${commodityData.name}" already exists`);
                        errorCount++;
                        continue;
                    }

                    await commodityModel.create(commodityData);
                    successCount++;
                } catch (error) {
                    errors.push(`Row ${successCount + errorCount + 1}: ${error.message}`);
                    errorCount++;
                }
            }

            responseReturn(res, 200, {
                success: true,
                message: `Upload completed. ${successCount} commodities added, ${errorCount} errors.`,
                count: successCount,
                errors: errors.slice(0, 10) // Show first 10 errors
            });
        } catch (error) {
            console.error('Error uploading commodities:', error);
            responseReturn(res, 500, { error: 'Failed to upload commodities' });
        }
    };

    // Add single commodity
    add_commodity = async (req, res) => {
        try {
            const { name, category, unit, description, basePrice } = req.body;

            if (!name) {
                return responseReturn(res, 400, { error: 'Commodity name is required' });
            }

            const commodity = await commodityModel.create({
                name,
                category,
                unit,
                description,
                basePrice: parseFloat(basePrice) || 0
            });

            responseReturn(res, 201, {
                success: true,
                message: 'Commodity added successfully',
                commodity
            });
        } catch (error) {
            console.error('Error adding commodity:', error);
            responseReturn(res, 500, { error: 'Failed to add commodity' });
        }
    };

    // Update commodity
    update_commodity = async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const commodity = await commodityModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!commodity) {
                return responseReturn(res, 404, { error: 'Commodity not found' });
            }

            responseReturn(res, 200, {
                success: true,
                message: 'Commodity updated successfully',
                commodity
            });
        } catch (error) {
            console.error('Error updating commodity:', error);
            responseReturn(res, 500, { error: 'Failed to update commodity' });
        }
    };

    // Delete commodity
    delete_commodity = async (req, res) => {
        try {
            const { id } = req.params;

            const commodity = await commodityModel.findByIdAndDelete(id);

            if (!commodity) {
                return responseReturn(res, 404, { error: 'Commodity not found' });
            }

            responseReturn(res, 200, {
                success: true,
                message: 'Commodity deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting commodity:', error);
            responseReturn(res, 500, { error: 'Failed to delete commodity' });
        }
    };
}

module.exports = new adminCommodityController();
