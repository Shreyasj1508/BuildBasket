const categoryModel = require('../../models/categoryModel')
const productModel = require('../../models/productModel')
const reviewModel = require('../../models/reviewModel')
const { responseReturn } = require("../../utiles/response")
const queryProducts = require('../../utiles/queryProducts')
const moment = require('moment')
const { mongo: {ObjectId}} = require('mongoose')
const { calculateCommissionSync } = require('../../utiles/commissionUtils')

class homeControllers{

    formateProduct = (products) => {
        const productArray = [];
        let i = 0;
        while (i < products.length ) {
            let temp = []
            let j = i
            while (j < i + 3) {
                if (products[j]) {
                    temp.push(products[j])
                }
                j++
            }
            productArray.push([...temp])
            i = j
        }
        return productArray
    }

    // Format products with commission information
    formateProductWithCommission = (products) => {
        const productArray = [];
        let i = 0;
        while (i < products.length ) {
            let temp = []
            let j = i
            while (j < i + 3) {
                if (products[j]) {
                    const product = products[j].toObject();
                    
                    // Use stored commission data if available, otherwise calculate
                    if (product.finalPrice && product.commissionAmount !== undefined) {
                        // Use stored commission data
                        product.commissionInfo = {
                            basePrice: product.price,
                            commissionAmount: product.commissionAmount,
                            finalPrice: product.finalPrice,
                            commissionType: product.commissionType || 'fixed'
                        };
                    } else {
                        // Calculate commission (fallback for products without stored data)
                        const commissionInfo = calculateCommissionSync(product.price);
                        product.commissionInfo = commissionInfo;
                        product.finalPrice = commissionInfo.finalPrice;
                        product.commissionAmount = commissionInfo.commissionAmount;
                    }

                    temp.push(product)
                }
                j++
            }
            productArray.push([...temp])
            i = j
        }
        return productArray
    }

    get_categorys = async(req,res) => {
        try {
            const categorys = await categoryModel.find({})
            responseReturn(res,200, {
                categorys
            })
            
        } catch (error) {
            console.log(error.message)
        }
    }
    // end method 

    get_products = async(req, res) => {
        try {
            console.log('Fetching products for homepage...');
            
            const products = await productModel.find({ status: 'active' }).limit(12).sort({
                createdAt: -1
            })
            const allProduct1 = await productModel.find({ status: 'active' }).limit(9).sort({
                createdAt: -1
            })
            const latest_product = this.formateProductWithCommission(allProduct1);
            
            const allProduct2 = await productModel.find({ status: 'active' }).limit(9).sort({
                rating: -1
            })
            const topRated_product = this.formateProductWithCommission(allProduct2);
           
            const allProduct3 = await productModel.find({ status: 'active' }).limit(9).sort({
                discount: -1
            })
            const discount_product = this.formateProductWithCommission(allProduct3);

            console.log(`Homepage API - Total products: ${products.length}`);
            console.log(`Homepage API - Latest products: ${allProduct1.length}`);
            console.log(`Homepage API - Top rated products: ${allProduct2.length}`);
            console.log(`Homepage API - Discount products: ${allProduct3.length}`);

            // Log sample products
            if (products.length > 0) {
                console.log('Sample homepage products:', products.slice(0, 2).map(p => ({
                    id: p._id,
                    name: p.name,
                    status: p.status,
                    createdAt: p.createdAt
                })));
            }

            responseReturn(res, 200,{
                products,
                latest_product,
                topRated_product,
                discount_product
            })
            
        } catch (error) {
            console.log('Error in get_products:', error.message)
            responseReturn(res, 500, { message: 'Error fetching products', error: error.message });
        }
    }
   // end method 

   price_range_product = async (req, res) => {
    try {
        const priceRange = {
            low: 0,
            high: 0,
        }
        const products = await productModel.find({ status: 'active' }).limit(9).sort({
            createdAt: -1 // 1 for asc -1 is for Desc
        })
        const latest_product = this.formateProduct(products);
        const getForPrice = await productModel.find({ status: 'active' }).sort({
            'price': 1
        })
        if (getForPrice.length > 0) {
            priceRange.high = getForPrice[getForPrice.length - 1].price
            priceRange.low = getForPrice[0].price
        }
        responseReturn(res, 200, {
            latest_product,
            priceRange
        })
        
    } catch (error) {
        console.log(error.message)
    }

   }

// end method 

query_products = async (req, res) => {
    const parPage = 12
    req.query.parPage = parPage

    try {
        console.log('Shops page query_products called...');
        
        // Decode URL parameters
        if (req.query.category) {
            req.query.category = decodeURIComponent(req.query.category);
        }
        if (req.query.searchValue) {
            req.query.searchValue = decodeURIComponent(req.query.searchValue);
        }
        
        const products = await productModel.find({ status: 'active' }).sort({
            createdAt: -1
        })
        
        console.log(`Shops API - Total active products: ${products.length}`);
        console.log(`Shops API - Query parameters:`, req.query);
        
        // Log some sample products
        if (products.length > 0) {
            console.log('Shops API - Sample products:', products.slice(0, 3).map(p => ({
                id: p._id,
                name: p.name,
                category: p.category,
                brand: p.brand,
                status: p.status,
                createdAt: p.createdAt
            })));
        }
        
        const totalProduct = new queryProducts(products, req.query).categoryQuery().ratingQuery().searchQuery().priceQuery().sortByPrice().countProducts();

        const result = new queryProducts(products, req.query).categoryQuery().ratingQuery().priceQuery().searchQuery().sortByPrice().skip().limit().getProducts();
        
        console.log(`Shops API - Filtered products count: ${result.length}`);
        
        // Log filtered results
        if (result.length > 0) {
            console.log('Shops API - Filtered sample products:', result.slice(0, 2).map(p => ({
                id: p._id,
                name: p.name,
                category: p.category,
                status: p.status
            })));
        }
        
        // Add commission information to each product
        const productsWithCommission = result.map(product => {
            const productObj = product.toObject();
            const commissionInfo = calculateCommissionSync(productObj.price);
            
            productObj.commissionInfo = commissionInfo;
            productObj.finalPrice = commissionInfo.finalPrice;
            productObj.commissionAmount = commissionInfo.commissionAmount;
            
            return productObj;
        });

        responseReturn(res, 200, {
            products: productsWithCommission,
            totalProduct,
            parPage
        })

        
    } catch (error) {
        console.log('❌ Query Products Error:', error.message)
        responseReturn(res, 500, { message: 'Error querying products', error: error.message });
    }
 
}
// end method 

product_details = async (req, res) => {
    const { slug } = req.params
    try {
        const product = await productModel.findOne({slug})
        
        const relatedProducts = await productModel.find({
            $and: [{
                _id: {
                    $ne: product.id
                }
            },
            {
                category: {
                    $eq: product.category 
                }
            }
           ]
        }).limit(12)
        const moreProducts = await productModel.find({
            $and: [{
                _id: {
                    $ne: product.id
                }
            },
            {
                sellerId: {
                    $eq: product.sellerId
                }
            }
           ]
        }).limit(3)
        responseReturn(res, 200, {
            product,
            relatedProducts,
            moreProducts
        })

    } catch (error) {
        console.log(error.message)
    }
}
// end method 

submit_review = async (req, res) => {
     const {productId,rating,review,name} = req.body

     try {
        await reviewModel.create({
            productId,
            name,
            rating,
            review,
            date: moment(Date.now()).format('LL')
        })

        let rat = 0;
        const reviews = await reviewModel.find({
            productId
        })
        for (let i = 0; i < reviews.length; i++) {
            rat = rat + reviews[i].rating 
        }
        let productRating = 0
        if (reviews.length !== 0) {
            productRating = (rat / reviews.length).toFixed(1)
        }

        await productModel.findByIdAndUpdate(productId,{
            rating : productRating
        })
        responseReturn(res, 201, {
            message: "Review Added Successfully"
        })

        
     } catch (error) {
        console.log(error.message)
     }
}
// end method 

get_reviews = async (req, res) => {
    const {productId} = req.params
    let {pageNo} = req.query 
    pageNo = parseInt(pageNo)
    const limit = 5
    const skipPage = limit * (pageNo - 1) 

    try {
        let getRating = await reviewModel.aggregate([{
            $match: {
                productId: {
                    $eq : new ObjectId(productId)
                },
                rating: {
                    $not: {
                        $size: 0
                    }
                }
            }
        },
        {
            $unwind: "$rating"
        },
        {
            $group: {
                _id: "$rating",
                count: {
                    $sum: 1
                }
            }
        } 
    ])
    let rating_review = [{
        rating: 5,
        sum : 0
    },
    {
        rating: 4,
        sum: 0
    },
    {
        rating: 3,
        sum: 0
    },
    {
        rating: 2,
        sum: 0
    },
    {
        rating: 1,
        sum: 0
    }
   ]
   for (let i = 0; i < rating_review.length; i++) {
        for (let j = 0; j < getRating.length; j++) {
            if (rating_review[i].rating === getRating[j]._id) {
                rating_review[i].sum = getRating[j].count
                break
            } 
        }  
   }

   const getAll = await reviewModel.find({
    productId
   })
   const reviews = await reviewModel.find({
    productId
   }).skip(skipPage).limit(limit).sort({createdAt: -1})

   responseReturn(res, 200, {
    reviews,
    totalReview: getAll.length,
    rating_review
   })
        
    } catch (error) {
        console.log(error.message)
    }
}
// end method

get_product_by_id = async (req, res) => {
    const {productId} = req.params
    try {
        const product = await productModel.findById(productId).populate('category')
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }
        res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        responseReturn(res,500,{error: error.message})
    }
}
// end method

}

module.exports = new homeControllers()