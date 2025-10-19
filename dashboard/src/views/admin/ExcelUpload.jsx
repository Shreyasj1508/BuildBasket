import React, { useState, useRef, useCallback } from "react";
import { FaFileExcel, FaUpload, FaDownload, FaSpinner } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import api from "../../api/api";
import toast from "react-hot-toast";

const ExcelUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadType, setUploadType] = useState("categories");
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef(null);

  // Function to completely reset file input with aggressive cleanup
  const resetFileInput = useCallback(() => {
    setSelectedFile(null);
    setFileInputKey((prev) => prev + 1);

    // Multiple cleanup attempts to ensure Windows releases the file
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
        // Force blur to release focus
        fileInputRef.current.blur();
      }
    }, 10);

    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 100);

    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 500);
  }, []);

  const uploadTypes = [
    {
      value: "categories",
      label: "Categories",
      description: "Upload product categories",
    },
    {
      value: "products",
      label: "Products",
      description: "Upload products data",
    },
    {
      value: "sellers",
      label: "Sellers",
      description: "Upload sellers information",
    },
    {
      value: "customers",
      label: "Customers",
      description: "Upload customer data",
    },
    { value: "banners", label: "Banners", description: "Upload banner images" },
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [".xlsx", ".xls"];
      const fileExtension = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      if (allowedTypes.includes(fileExtension)) {
        setSelectedFile(file);
        toast.success("File selected successfully!");
      } else {
        toast.error("Please select an Excel file (.xlsx or .xls)");
        resetFileInput();
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first!");
      return;
    }

    setUploading(true);
    setUploadResults(null);

    try {
      const formData = new FormData();
      formData.append("excelFile", selectedFile);

      const response = await api.post(`/excel/import/${uploadType}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);
      console.log("Response status:", response.status);

      if (response.status === 200 && response.data.message) {
        setUploadResults(response.data);

        // Handle both old and new response formats
        const data = response.data.results || response.data;

        // Show success message based on actual results
        const successCount = data.success || response.data.success || 0;
        const errorCount = data.errors || response.data.errors || 0;
        const totalProducts =
          data.totalProducts || response.data.totalProducts || 0;
        const activeProducts =
          data.activeProducts || response.data.activeProducts || 0;
        const inactiveProducts =
          data.inactiveProducts || response.data.inactiveProducts || 0;
        const pendingProducts =
          data.pendingProducts || response.data.pendingProducts || 0;

        if (successCount > 0 && errorCount === 0) {
          toast.success(
            `✅ Successfully uploaded ${uploadType}! ${successCount} items processed.`
          );
        } else if (successCount > 0 && errorCount > 0) {
          toast.success(
            `⚠️ Upload completed: ${successCount} successful, ${errorCount} errors. Check details below.`
          );
        } else if (errorCount > 0) {
          toast.error(
            `❌ Upload failed: ${errorCount} errors. Check details below.`
          );
        } else {
          toast.success(`✅ Upload completed: ${response.data.message}`);
        }

        // Show database status for products
        if (uploadType === "products") {
          setTimeout(() => {
            toast.success(
              `📊 Database Status: ${totalProducts} total, ${activeProducts} active, ${inactiveProducts} inactive, ${pendingProducts} pending`
            );
          }, 1000);
        }

        // Show refresh message for products
        if (uploadType === "products" && successCount > 0) {
          setTimeout(() => {
            toast.success(
              "🔄 Please refresh the frontend page to see the new products!"
            );
          }, 2000);
        }

        resetFileInput(); // Use reset function
      } else {
        toast.error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      // Fetch real data from backend for template
      const response = await api.get(`/excel/templates/${uploadType}`);
      if (response.data && response.data.template) {
        const csvContent = convertToCSV(response.data.template.sampleData);
        downloadCSV(csvContent, `${uploadType}_template.csv`);
        toast.success("Template downloaded with real data!");
      } else {
        // Fallback to local sample data
        const sampleData = getSampleData(uploadType);
        const csvContent = convertToCSV(sampleData);
        downloadCSV(csvContent, `${uploadType}_template.csv`);
        toast.success("Template downloaded!");
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      // Fallback to local sample data
      const sampleData = getSampleData(uploadType);
      const csvContent = convertToCSV(sampleData);
      downloadCSV(csvContent, `${uploadType}_template.csv`);
      toast.success("Template downloaded!");
    }
  };

  const getSampleData = (type) => {
    switch (type) {
      case "categories":
        return [
          {
            name: "Electronics",
            slug: "electronics",
            description: "Electronic products",
          },
          {
            name: "Clothing",
            slug: "clothing",
            description: "Fashion and clothing",
          },
          { name: "Books", slug: "books", description: "Books and literature" },
        ];
      case "products":
        return [
          {
            name: "Steel Rod 12mm",
            slug: "steel-rod-12mm",
            price: 450.00,
            category: "Construction",
            brand: "Tata Steel",
            sellerId: "seller123",
            shopName: "Steel Suppliers Ltd",
            images: "steel-rod-1.jpg,steel-rod-2.jpg",
            description: "High quality steel rod for construction purposes",
            stock: 100,
            discount: 5,
            rating: 4.5,
            status: "active",
            location_state: "Maharashtra",
            location_city: "Mumbai",
            location_region: "Western",
            eligibleForCreditSale: true
          },
          {
            name: "Portland Cement 50kg",
            slug: "portland-cement-50kg",
            price: 320.00,
            category: "Construction",
            brand: "UltraTech",
            sellerId: "seller456",
            shopName: "Cement Distributors",
            images: "cement-1.jpg,cement-2.jpg",
            description: "Premium quality Portland cement for construction",
            stock: 50,
            discount: 8,
            rating: 4.3,
            status: "active",
            location_state: "Maharashtra",
            location_city: "Pune",
            location_region: "Western",
            eligibleForCreditSale: true
          },
          {
            name: "Fine Sand 1 Ton",
            slug: "fine-sand-1-ton",
            price: 1800.00,
            category: "Construction",
            brand: "River Sand",
            sellerId: "seller789",
            shopName: "Sand Traders",
            images: "sand-1.jpg,sand-2.jpg",
            description: "Clean fine sand for construction and masonry work",
            stock: 25,
            discount: 10,
            rating: 4.2,
            status: "active",
            location_state: "Maharashtra",
            location_city: "Nashik",
            location_region: "Northern",
            eligibleForCreditSale: false
          }
        ];
      case "sellers":
        return [
          {
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            shopName: "John's Store",
            phone: "1234567890",
            address: "123 Main St, City",
            status: "active",
          },
          {
            name: "Jane Smith",
            email: "jane@example.com",
            password: "password456",
            shopName: "Jane's Shop",
            phone: "0987654321",
            address: "456 Oak Ave, Town",
            status: "active",
          },
        ];
      case "customers":
        return [
          {
            name: "Customer One",
            email: "customer1@example.com",
            password: "password123",
            phone: "1111111111",
            address: "789 Pine St, Village",
            status: "active",
          },
          {
            name: "Customer Two",
            email: "customer2@example.com",
            password: "password456",
            phone: "2222222222",
            address: "321 Elm St, Town",
            status: "active",
          },
        ];
      case "banners":
        return [
          {
            name: "Banner 1",
            image: "banner1.jpg",
            link: "https://example.com",
            status: "active",
          },
          {
            name: "Banner 2",
            image: "banner2.jpg",
            link: "https://example.com",
            status: "active",
          },
        ];
      default:
        return [];
    }
  };

  const convertToCSV = (data) => {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];

    data.forEach((row) => {
      const values = headers.map((header) => {
        const value = row[header];
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      });
      csvRows.push(values.join(","));
    });

    return csvRows.join("\n");
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-2 md:px-7 py-5">
      <div className="w-full bg-gradient-to-br from-[#eb8f34] to-[#d17a1e] rounded-xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <FaFileExcel className="text-2xl text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Excel Data Upload
            </h2>
            <p className="text-white/90">Upload data to update your database</p>
          </div>
        </div>

        {/* Upload Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Data Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadTypes.map((type) => (
              <div
                key={type.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  uploadType === type.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => {
                  setUploadType(type.value);
                  resetFileInput();
                }}
              >
                <h3 className="font-semibold text-gray-800">{type.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{type.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Excel File
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id={`file-upload-${fileInputKey}`}
              key={fileInputKey}
              autoComplete="off"
            />
            <label
              htmlFor={`file-upload-${fileInputKey}`}
              className="cursor-pointer"
            >
              <MdCloudUpload className="text-4xl text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">
                {selectedFile
                  ? selectedFile.name
                  : "Click to select Excel file"}
              </p>
              <p className="text-sm text-gray-500">
                Supports .xlsx and .xls files
              </p>
            </label>
            {selectedFile && (
              <div className="mt-2 space-x-4">
                <button
                  onClick={resetFileInput}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Clear File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={downloadTemplate}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <FaDownload className="text-sm" />
            Download Template
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors"
          >
            {uploading ? (
              <FaSpinner className="text-sm animate-spin" />
            ) : (
              <FaUpload className="text-sm" />
            )}
            {uploading ? "Uploading..." : "Upload File"}
          </button>
        </div>

        {/* Upload Results */}
        {uploadResults && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="mb-3">
              <h3 className="font-semibold text-gray-800">Upload Results</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-green-800 font-semibold">Success</p>
                <p className="text-2xl font-bold text-green-600">
                  {uploadResults.success || 0}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <p className="text-red-800 font-semibold">Errors</p>
                <p className="text-2xl font-bold text-red-600">
                  {uploadResults.errors || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-blue-800 font-semibold">Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(uploadResults.success || 0) + (uploadResults.errors || 0)}
                </p>
              </div>
            </div>

            {uploadResults.details && uploadResults.details.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Details:</h4>
                <div className="bg-white rounded p-3 max-h-40 overflow-y-auto">
                  {uploadResults.details.map((detail, index) => (
                    <p key={index} className="text-sm text-gray-600 mb-1">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Download the template first to see the required format</li>
            <li>• Fill in your data following the template structure</li>
            <li>• Save as Excel format (.xlsx or .xls)</li>
            <li>• Upload the file to update your database</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExcelUpload;
