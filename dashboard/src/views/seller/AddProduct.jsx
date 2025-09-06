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

  const [errors, setErrors] = useState({});

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
                disabled={loader ? true : false}
                className="btn-primary w-[280px] mb-3"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
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
    </div>
  );
};

export default AddProduct;
