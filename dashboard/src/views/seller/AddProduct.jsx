import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdImages } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { get_category } from "../../store/Reducers/categoryReducer";
import { add_product, messageClear } from "../../store/Reducers/productReducer";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import toast from "react-hot-toast";
import VerificationStatus from "../../components/VerificationStatus";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categorys } = useSelector((state) => state.category);
  const { loader, successMessage, errorMessage } = useSelector(
    (state) => state.product
  );
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      get_category({
        searchValue: "",
        parPage: "",
        page: "",
      })
    );
  }, []);

  const [state, setState] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    brand: "",
    stock: "",
  });

  // Region and fare management states
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [regionFares, setRegionFares] = useState({});
  const [gstRate, setGstRate] = useState(18); // Default GST rate
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [newRegion, setNewRegion] = useState('');
  const [newFare, setNewFare] = useState('');

  // Available regions list (matching backend database regions)
  const availableRegions = [
    'Northern', 'Southern', 'Eastern', 'Western', 'Central'
  ];

  const [errors, setErrors] = useState({});

  // Region management functions
  const addRegion = () => {
    if (newRegion && newFare && parseFloat(newFare) > 0) {
      if (!selectedRegions.includes(newRegion)) {
        setSelectedRegions([...selectedRegions, newRegion]);
        setRegionFares({
          ...regionFares,
          [newRegion]: parseFloat(newFare)
        });
        setNewRegion('');
        setNewFare('');
        setShowRegionModal(false);
        toast.success(`Region ${newRegion} added with fare ₹${newFare}`);
      } else {
        toast.error('Region already selected');
      }
    } else {
      toast.error('Please enter valid region and fare');
    }
  };

  const removeRegion = (region) => {
    setSelectedRegions(selectedRegions.filter(r => r !== region));
    const newRegionFares = { ...regionFares };
    delete newRegionFares[region];
    setRegionFares(newRegionFares);
    toast.success(`Region ${region} removed`);
  };

  const updateRegionFare = (region, fare) => {
    if (fare && parseFloat(fare) > 0) {
      setRegionFares({
        ...regionFares,
        [region]: parseFloat(fare)
      });
    }
  };

  // Calculate total cost with commission and GST
  const calculateTotalCost = (basePrice, region) => {
    const fare = regionFares[region] || 0;
    const commission = (basePrice * 0.05); // 5% commission
    const subtotal = basePrice + commission + fare;
    const gst = (subtotal * gstRate) / 100;
    return {
      basePrice,
      commission,
      fare,
      subtotal,
      gst,
      total: subtotal + gst
    };
  };

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  };

  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const categorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allCategory.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllCategory(srcValue);
    } else {
      setAllCategory(categorys);
    }
  };

  const [images, setImages] = useState([]);
  const [imageShow, setImageShow] = useState([]);

  const imageHandle = (e) => {
    const files = e.target.files;
    const length = files.length;
    if (length > 0) {
      // Validate file types
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const validFiles = Array.from(files).filter(file => validTypes.includes(file.type))
      
      if (validFiles.length !== files.length) {
        toast.error('Some files are not valid images. Please use JPG, PNG, or WebP format.')
        return
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      const sizeValidFiles = validFiles.filter(file => file.size <= maxSize)
      
      if (sizeValidFiles.length !== validFiles.length) {
        toast.error('Some files are too large. Maximum size is 5MB per image.')
        return
      }

      setImages([...images, ...sizeValidFiles]);
      let imageUrl = [];
      for (let i = 0; i < sizeValidFiles.length; i++) {
        imageUrl.push({ url: URL.createObjectURL(sizeValidFiles[i]) });
      }
      setImageShow([...imageShow, ...imageUrl]);
    }
  };

  const validateForm = () => {
    const newErrors = {}
    
    if (!state.name.trim()) {
      newErrors.name = 'Product name is required'
    }
    
    if (!state.description.trim()) {
      newErrors.description = 'Product description is required'
    }
    
    if (!state.brand.trim()) {
      newErrors.brand = 'Product brand is required'
    }
    
    if (!category) {
      newErrors.category = 'Please select a category'
    }
    
    if (!state.price || state.price <= 0) {
      newErrors.price = 'Valid price is required'
    }
    
    if (!state.stock || state.stock < 0) {
      newErrors.stock = 'Valid stock quantity is required'
    }
    
    if (state.discount && (state.discount < 0 || state.discount > 100)) {
      newErrors.discount = 'Discount must be between 0 and 100'
    }

    if (selectedRegions.length === 0) {
      newErrors.regions = 'Please select at least one region'
    }

    // Validate region fares
    for (const region of selectedRegions) {
      if (!regionFares[region] || regionFares[region] <= 0) {
        newErrors.regions = 'Please set valid fare for all selected regions'
        break
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const changeImage = (img, index) => {
    if (img) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(img.type)) {
        toast.error('Please select a valid image file (JPG, PNG, WebP)')
        return
      }
      
      if (img.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      let tempUrl = imageShow;
      let tempImages = images;

      tempImages[index] = img;
      tempUrl[index] = { url: URL.createObjectURL(img) };
      setImageShow([...tempUrl]);
      setImages([...tempImages]);
    }
  };

  const removeImage = (i) => {
    const filterImage = images.filter((img, index) => index !== i);
    const filterImageUrl = imageShow.filter((img, index) => index !== i);

    setImages(filterImage);
    setImageShow(filterImageUrl);
  };

  const add = (e) => {
    e.preventDefault();

    console.log('Form submission started');
    console.log('Form data:', state);
    console.log('Category:', category);
    console.log('Images count:', images.length);

    // Check seller verification status
    if (userInfo?.status !== 'active') {
      toast.error('Your account is not verified yet. Please wait for admin approval before adding products.');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    const formData = new FormData();
    formData.append("name", state.name.trim());
    formData.append("description", state.description.trim());
    formData.append("price", state.price);
    formData.append("stock", state.stock);
    formData.append("discount", state.discount || 0);
    formData.append("brand", state.brand.trim());
    formData.append("shopName", userInfo?.shopInfo?.shopName || 'BuildBasket');
    formData.append("category", category);
    formData.append("selectedRegions", JSON.stringify(selectedRegions));
    formData.append("regionFares", JSON.stringify(regionFares));
    formData.append("gstRate", gstRate);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    console.log('Dispatching add_product action...');
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    dispatch(add_product(formData));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: "",
        description: "",
        discount: "",
        price: "",
        brand: "",
        stock: "",
      });
      setImageShow([]);
      setImages([]);
      setCategory("");
      setErrors({});
      setSelectedRegions([]);
      setRegionFares({});
      setGstRate(18);
      // Navigate to products page after successful creation
      navigate('/seller/dashboard/products');
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch, navigate]);

  useEffect(() => {
    setAllCategory(categorys);
  }, [categorys]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-semibold">Add Product</h1>
          <Link
            to="/seller/dashboard/products"
            className="btn-secondary px-7 py-2 my-2 inline-block"
          >
            All Products
          </Link>
        </div>
        
        {/* Verification Status */}
        {userInfo && userInfo.status !== 'active' && (
          <div className="mb-4">
            <VerificationStatus status={userInfo.status} />
          </div>
        )}
        
        <div>
          <form onSubmit={add}>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="name">Product Name *</label>
                <input
                  className={`px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border rounded-md text-[#d0d2d6] ${errors.name ? 'border-red-500' : 'border-slate-700'}`}
                  onChange={inputHandle}
                  value={state.name}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Product Name"
                />
                {errors.name && <span className='text-red-400 text-sm'>{errors.name}</span>}
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="brand">Product Brand *</label>
                <input
                  className={`px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border rounded-md text-[#d0d2d6] ${errors.brand ? 'border-red-500' : 'border-slate-700'}`}
                  onChange={inputHandle}
                  value={state.brand}
                  type="text"
                  name="brand"
                  id="brand"
                  placeholder="Brand Name"
                />
                {errors.brand && <span className='text-red-400 text-sm'>{errors.brand}</span>}
              </div>
            </div>

            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1 relative">
                <label htmlFor="category">Category *</label>
                <input
                  readOnly
                  onClick={() => setCateShow(!cateShow)}
                  className={`px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border rounded-md text-[#d0d2d6] ${errors.category ? 'border-red-500' : 'border-slate-700'}`}
                  value={category}
                  type="text"
                  id="category"
                  placeholder="--select category--"
                />
                {errors.category && <span className='text-red-400 text-sm'>{errors.category}</span>}

                <div
                  className={`absolute top-[101%] bg-[#475569] w-full transition-all ${
                    cateShow ? "scale-100" : "scale-0"
                  } z-50`}
                >
                  <div className="w-full px-4 py-2 fixed">
                    <input
                      value={searchValue}
                      onChange={categorySearch}
                      className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                      type="text"
                      placeholder="search"
                    />
                  </div>
                  <div className="pt-14"></div>
                  <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scrool">
                    {allCategory.map((c, i) => (
                      <span
                        key={i}
                        className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                          category === c.name && "bg-indigo-500"
                        }`}
                        onClick={() => {
                          setCateShow(false);
                          setCategory(c.name);
                          setSearchValue("");
                          setAllCategory(categorys);
                          if (errors.category) {
                            setErrors({...errors, category: ''})
                          }
                        }}
                      >
                        {c.name}{" "}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="stock">Product Stock *</label>
                <input
                  className={`px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border rounded-md text-[#d0d2d6] ${errors.stock ? 'border-red-500' : 'border-slate-700'}`}
                  onChange={inputHandle}
                  value={state.stock}
                  type="number"
                  name="stock"
                  id="stock"
                  placeholder="Stock"
                  min="0"
                />
                {errors.stock && <span className='text-red-400 text-sm'>{errors.stock}</span>}
              </div>
            </div>

            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="price">Price *</label>
                <input
                  className={`px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border rounded-md text-[#d0d2d6] ${errors.price ? 'border-red-500' : 'border-slate-700'}`}
                  onChange={inputHandle}
                  value={state.price}
                  type="number"
                  name="price"
                  id="price"
                  placeholder="price"
                  min="0"
                  step="0.01"
                />
                {errors.price && <span className='text-red-400 text-sm'>{errors.price}</span>}
              </div>

              <div className="flex flex-col w-full gap-1">
                <label htmlFor="discount">Discount (%)</label>
                <input
                  className={`px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border rounded-md text-[#d0d2d6] ${errors.discount ? 'border-red-500' : 'border-slate-700'}`}
                  onChange={inputHandle}
                  value={state.discount}
                  type="number"
                  name="discount"
                  id="discount"
                  placeholder="discount by %"
                  min="0"
                  max="100"
                />
                {errors.discount && <span className='text-red-400 text-sm'>{errors.discount}</span>}
              </div>
            </div>

            <div className="flex flex-col w-full gap-1 mb-5">
              <label htmlFor="description" className="text-[#d0d2d6]">
                Description *
              </label>
              <textarea
                className={`px-4 py-2 focus:border-indigo-500 outline-none bg-[#6a5fdf] border rounded-md text-[#d0d2d6] ${errors.description ? 'border-red-500' : 'border-slate-700'}`}
                onChange={inputHandle}
                value={state.description}
                name="description"
                id="description"
                placeholder="Description"
                cols="10"
                rows="4"
              ></textarea>
              {errors.description && <span className='text-red-400 text-sm'>{errors.description}</span>}
            </div>

            {/* Region Selection and Fare Management */}
            <div className="flex flex-col w-full gap-4 mb-5 text-[#d0d2d6]">
              <div className="flex justify-between items-center">
                <label className="text-[#d0d2d6] font-semibold">
                  Sales Regions & Fares *
                </label>
                <button
                  type="button"
                  onClick={() => setShowRegionModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
                >
                  Add Region
                </button>
              </div>
              
              {errors.regions && <span className='text-red-400 text-sm'>{errors.regions}</span>}

              {/* Selected Regions */}
              {selectedRegions.length > 0 && (
                <div className="space-y-3">
                  {selectedRegions.map((region, index) => {
                    const costBreakdown = calculateTotalCost(parseFloat(state.price) || 0, region);
                    return (
                      <div key={index} className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-indigo-300">{region}</h4>
                          <button
                            type="button"
                            onClick={() => removeRegion(region)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-300">Fixed Fare (₹)</label>
                            <input
                              type="number"
                              value={regionFares[region] || ''}
                              onChange={(e) => updateRegionFare(region, e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
                              placeholder="Enter fare"
                              min="0"
                              step="0.01"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-300">GST Rate (%)</label>
                            <input
                              type="number"
                              value={gstRate}
                              onChange={(e) => setGstRate(parseFloat(e.target.value) || 18)}
                              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
                              min="0"
                              max="100"
                              step="0.01"
                            />
                          </div>
                        </div>

                        {/* Cost Breakdown */}
                        {state.price && (
                          <div className="mt-3 p-3 bg-slate-900 rounded-md">
                            <h5 className="text-sm font-semibold text-green-300 mb-2">Cost Breakdown for {region}:</h5>
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between">
                                <span>Base Price:</span>
                                <span>₹{costBreakdown.basePrice.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Commission (5%):</span>
                                <span>₹{costBreakdown.commission.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Region Fare:</span>
                                <span>₹{costBreakdown.fare.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>₹{costBreakdown.subtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-green-300">
                                <span>GST ({gstRate}%):</span>
                                <span>₹{costBreakdown.gst.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-yellow-300 font-semibold border-t border-slate-600 pt-1">
                                <span>Total:</span>
                                <span>₹{costBreakdown.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedRegions.length === 0 && (
                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-slate-600 rounded-lg">
                  <p>No regions selected</p>
                  <p className="text-sm">Click "Add Region" to start selling in specific regions</p>
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 gap-3 w-full text-[#d0d2d6] mb-4">
              {imageShow.map((img, i) => (
                <div key={i} className="h-[180px] relative">
                  <label htmlFor={i}>
                    <img
                      className="w-full h-full rounded-sm object-cover"
                      src={img.url}
                      alt=""
                    />
                  </label>
                  <input
                    onChange={(e) => changeImage(e.target.files[0], i)}
                    type="file"
                    id={i}
                    className="hidden"
                    accept="image/*"
                  />
                  <span
                    onClick={() => removeImage(i)}
                    className="p-2 z-10 cursor-pointer bg-slate-700 hover:shadow-lg hover:shadow-slate-400/50 text-white absolute top-1 right-1 rounded-full"
                  >
                    <IoMdCloseCircle />
                  </span>
                </div>
              ))}

              <label
                className="flex justify-center items-center flex-col h-[180px] cursor-pointer border border-dashed hover:border-red-500 w-full text-[#d0d2d6]"
                htmlFor="image"
              >
                <span>
                  <IoMdImages />
                </span>
                <span>Select Image </span>
                <span className='text-xs text-gray-400'>Max 5MB per image</span>
              </label>
              <input
                className="hidden"
                onChange={imageHandle}
                multiple
                type="file"
                id="image"
                accept="image/*"
              />
            </div>

            <div className="flex gap-4">
              <button
                disabled={loader || userInfo?.status !== 'active'}
                className={`w-[280px] mb-3 ${
                  userInfo?.status !== 'active' 
                    ? 'bg-gray-400 cursor-not-allowed text-white px-7 py-2 rounded-md' 
                    : 'btn-primary'
                }`}
                title={userInfo?.status !== 'active' ? 'Account verification required' : ''}
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                ) : userInfo?.status !== 'active' ? (
                  "Verification Required"
                ) : (
                  "Add Product"
                )}
              </button>
              
              <button 
                type="button"
                onClick={() => navigate('/seller/dashboard/products')}
                className='btn-secondary w-[200px] mb-3'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Region Selection Modal */}
      {showRegionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#6a5fdf] p-6 rounded-lg w-full max-w-md mx-4">
            <h3 className="text-[#d0d2d6] text-lg font-semibold mb-4">Add Sales Region</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[#d0d2d6] text-sm">Select Region</label>
                <select
                  value={newRegion}
                  onChange={(e) => setNewRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="">Choose a region</option>
                  {availableRegions
                    .filter(region => !selectedRegions.includes(region))
                    .map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                </select>
              </div>
              
              <div>
                <label className="text-[#d0d2d6] text-sm">Fixed Fare (₹)</label>
                <input
                  type="number"
                  value={newFare}
                  onChange={(e) => setNewFare(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                  placeholder="Enter fare amount"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-400 mt-1">
                  This fare will be added to the total cost along with commission and GST
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={addRegion}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
              >
                Add Region
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRegionModal(false);
                  setNewRegion('');
                  setNewFare('');
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
