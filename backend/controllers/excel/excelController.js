const XLSX = require('xlsx');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { responseReturn } = require('../../utiles/response');

// Import all models
const categoryModel = require('../../models/categoryModel');
const productModel = require('../../models/productModel');
const sellerModel = require('../../models/sellerModel');
const customerModel = require('../../models/customerModel');
const bannerModel = require('../../models/bannerModel');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/excel');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files (.xlsx, .xls) are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

class ExcelController {
  
  // Upload Excel file
  uploadExcel = upload.single('excelFile');

  // Import Categories from Excel
  importCategories = async (req, res) => {
    try {
      if (!req.file) {
        return responseReturn(res, 400, { message: 'No Excel file uploaded' });
      }

      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        return responseReturn(res, 400, { message: 'Excel file is empty' });
      }

      const results = {
        success: 0,
        errors: 0,
        details: []
      };

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          // Validate required fields
          if (!row.name || !row.slug) {
            results.errors++;
            results.details.push(`Row ${i + 2}: Missing required fields (name, slug)`);
            continue;
          }

          // Check if category already exists
          const existingCategory = await categoryModel.findOne({ slug: row.slug });
          if (existingCategory) {
            // Update existing category
            await categoryModel.findByIdAndUpdate(existingCategory._id, {
              name: row.name,
              slug: row.slug,
              image: row.image || existingCategory.image,
              description: row.description || existingCategory.description
            });
            results.success++;
            results.details.push(`Row ${i + 2}: Updated category "${row.name}"`);
          } else {
            // Create new category
            await categoryModel.create({
              name: row.name,
              slug: row.slug,
              image: row.image || '',
              description: row.description || ''
            });
            results.success++;
            results.details.push(`Row ${i + 2}: Created category "${row.name}"`);
          }
        } catch (error) {
          results.errors++;
          results.details.push(`Row ${i + 2}: Error - ${error.message}`);
        }
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      responseReturn(res, 200, {
        message: 'Categories import completed',
        results: results
      });

    } catch (error) {
      console.error('Excel import error:', error);
      responseReturn(res, 500, { message: 'Error importing categories', error: error.message });
    }
  };

  // Import Products from Excel
  importProducts = async (req, res) => {
    try {
      if (!req.file) {
        return responseReturn(res, 400, { message: 'No Excel file uploaded' });
      }

      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        return responseReturn(res, 400, { message: 'Excel file is empty' });
      }

      const results = {
        success: 0,
        errors: 0,
        details: []
      };

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          // Validate required fields
          if (!row.name || !row.price || !row.category || !row.sellerId) {
            results.errors++;
            results.details.push(`Row ${i + 2}: Missing required fields (name, price, category, sellerId)`);
            continue;
          }

          // Check if product already exists
          const existingProduct = await productModel.findOne({ slug: row.slug || row.name.toLowerCase().replace(/\s+/g, '-') });
          
          const productData = {
            name: row.name,
            slug: row.slug || row.name.toLowerCase().replace(/\s+/g, '-'),
            price: parseFloat(row.price),
            category: row.category,
            sellerId: row.sellerId,
            shopName: row.shopName || '',
            images: row.images ? row.images.split(',').map(img => img.trim()) : [],
            description: row.description || '',
            stock: parseInt(row.stock) || 0,
            discount: parseInt(row.discount) || 0,
            rating: parseFloat(row.rating) || 0,
            status: row.status || 'active'
          };

          if (existingProduct) {
            // Update existing product
            await productModel.findByIdAndUpdate(existingProduct._id, productData);
            results.success++;
            results.details.push(`Row ${i + 2}: Updated product "${row.name}"`);
          } else {
            // Create new product
            await productModel.create(productData);
            results.success++;
            results.details.push(`Row ${i + 2}: Created product "${row.name}"`);
          }
        } catch (error) {
          results.errors++;
          results.details.push(`Row ${i + 2}: Error - ${error.message}`);
        }
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      responseReturn(res, 200, {
        message: 'Products import completed',
        results: results
      });

    } catch (error) {
      console.error('Excel import error:', error);
      responseReturn(res, 500, { message: 'Error importing products', error: error.message });
    }
  };

  // Import Sellers from Excel
  importSellers = async (req, res) => {
    try {
      if (!req.file) {
        return responseReturn(res, 400, { message: 'No Excel file uploaded' });
      }

      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        return responseReturn(res, 400, { message: 'Excel file is empty' });
      }

      const results = {
        success: 0,
        errors: 0,
        details: []
      };

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          // Validate required fields
          if (!row.name || !row.email || !row.phone) {
            results.errors++;
            results.details.push(`Row ${i + 2}: Missing required fields (name, email, phone)`);
            continue;
          }

          // Check if seller already exists
          const existingSeller = await sellerModel.findOne({ email: row.email });
          
          const sellerData = {
            name: row.name,
            email: row.email,
            phone: row.phone,
            password: row.password || 'defaultPassword123',
            shopName: row.shopName || row.name,
            address: row.address || '',
            city: row.city || '',
            state: row.state || '',
            pincode: row.pincode || '',
            image: row.image || '',
            status: row.status || 'active'
          };

          if (existingSeller) {
            // Update existing seller
            await sellerModel.findByIdAndUpdate(existingSeller._id, sellerData);
            results.success++;
            results.details.push(`Row ${i + 2}: Updated seller "${row.name}"`);
          } else {
            // Create new seller
            await sellerModel.create(sellerData);
            results.success++;
            results.details.push(`Row ${i + 2}: Created seller "${row.name}"`);
          }
        } catch (error) {
          results.errors++;
          results.details.push(`Row ${i + 2}: Error - ${error.message}`);
        }
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      responseReturn(res, 200, {
        message: 'Sellers import completed',
        results: results
      });

    } catch (error) {
      console.error('Excel import error:', error);
      responseReturn(res, 500, { message: 'Error importing sellers', error: error.message });
    }
  };

  // Import Customers from Excel
  importCustomers = async (req, res) => {
    try {
      if (!req.file) {
        return responseReturn(res, 400, { message: 'No Excel file uploaded' });
      }

      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        return responseReturn(res, 400, { message: 'Excel file is empty' });
      }

      const results = {
        success: 0,
        errors: 0,
        details: []
      };

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          // Validate required fields
          if (!row.name || !row.email || !row.phone) {
            results.errors++;
            results.details.push(`Row ${i + 2}: Missing required fields (name, email, phone)`);
            continue;
          }

          // Check if customer already exists
          const existingCustomer = await customerModel.findOne({ email: row.email });
          
          const customerData = {
            name: row.name,
            email: row.email,
            phone: row.phone,
            password: row.password || 'defaultPassword123',
            address: row.address || '',
            city: row.city || '',
            state: row.state || '',
            pincode: row.pincode || '',
            image: row.image || '',
            status: row.status || 'active'
          };

          if (existingCustomer) {
            // Update existing customer
            await customerModel.findByIdAndUpdate(existingCustomer._id, customerData);
            results.success++;
            results.details.push(`Row ${i + 2}: Updated customer "${row.name}"`);
          } else {
            // Create new customer
            await customerModel.create(customerData);
            results.success++;
            results.details.push(`Row ${i + 2}: Created customer "${row.name}"`);
          }
        } catch (error) {
          results.errors++;
          results.details.push(`Row ${i + 2}: Error - ${error.message}`);
        }
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      responseReturn(res, 200, {
        message: 'Customers import completed',
        results: results
      });

    } catch (error) {
      console.error('Excel import error:', error);
      responseReturn(res, 500, { message: 'Error importing customers', error: error.message });
    }
  };

  // Import Banners from Excel
  importBanners = async (req, res) => {
    try {
      if (!req.file) {
        return responseReturn(res, 400, { message: 'No Excel file uploaded' });
      }

      const filePath = req.file.path;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        return responseReturn(res, 400, { message: 'Excel file is empty' });
      }

      const results = {
        success: 0,
        errors: 0,
        details: []
      };

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
          // Validate required fields
          if (!row.title || !row.image) {
            results.errors++;
            results.details.push(`Row ${i + 2}: Missing required fields (title, image)`);
            continue;
          }

          // Check if banner already exists
          const existingBanner = await bannerModel.findOne({ title: row.title });
          
          const bannerData = {
            title: row.title,
            image: row.image,
            description: row.description || '',
            link: row.link || '',
            status: row.status || 'active',
            order: parseInt(row.order) || 0
          };

          if (existingBanner) {
            // Update existing banner
            await bannerModel.findByIdAndUpdate(existingBanner._id, bannerData);
            results.success++;
            results.details.push(`Row ${i + 2}: Updated banner "${row.title}"`);
          } else {
            // Create new banner
            await bannerModel.create(bannerData);
            results.success++;
            results.details.push(`Row ${i + 2}: Created banner "${row.title}"`);
          }
        } catch (error) {
          results.errors++;
          results.details.push(`Row ${i + 2}: Error - ${error.message}`);
        }
      }

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      responseReturn(res, 200, {
        message: 'Banners import completed',
        results: results
      });

    } catch (error) {
      console.error('Excel import error:', error);
      responseReturn(res, 500, { message: 'Error importing banners', error: error.message });
    }
  };

  // Get sample Excel templates
  getSampleTemplates = async (req, res) => {
    try {
      const templates = {
        categories: {
          headers: ['name', 'slug', 'image', 'description'],
          sampleData: [
            ['Electronics', 'electronics', 'https://example.com/electronics.jpg', 'Electronic products'],
            ['Clothing', 'clothing', 'https://example.com/clothing.jpg', 'Clothing and apparel']
          ]
        },
        products: {
          headers: ['name', 'slug', 'price', 'category', 'sellerId', 'shopName', 'images', 'description', 'stock', 'discount', 'rating', 'status'],
          sampleData: [
            ['iPhone 15', 'iphone-15', '999', 'Electronics', 'seller123', 'TechStore', 'https://example.com/iphone1.jpg,https://example.com/iphone2.jpg', 'Latest iPhone', '50', '10', '4.5', 'active']
          ]
        },
        sellers: {
          headers: ['name', 'email', 'phone', 'password', 'shopName', 'address', 'city', 'state', 'pincode', 'image', 'status'],
          sampleData: [
            ['John Doe', 'john@example.com', '1234567890', 'password123', 'John\'s Store', '123 Main St', 'Mumbai', 'Maharashtra', '400001', 'https://example.com/john.jpg', 'active']
          ]
        },
        customers: {
          headers: ['name', 'email', 'phone', 'password', 'address', 'city', 'state', 'pincode', 'image', 'status'],
          sampleData: [
            ['Jane Smith', 'jane@example.com', '0987654321', 'password123', '456 Oak Ave', 'Delhi', 'Delhi', '110001', 'https://example.com/jane.jpg', 'active']
          ]
        },
        banners: {
          headers: ['title', 'image', 'description', 'link', 'status', 'order'],
          sampleData: [
            ['Summer Sale', 'https://example.com/summer-banner.jpg', 'Big summer sale', '/sale', 'active', '1']
          ]
        }
      };

      responseReturn(res, 200, {
        message: 'Sample templates retrieved successfully',
        templates: templates
      });

    } catch (error) {
      console.error('Error getting templates:', error);
      responseReturn(res, 500, { message: 'Error retrieving templates', error: error.message });
    }
  };
}

module.exports = new ExcelController();
