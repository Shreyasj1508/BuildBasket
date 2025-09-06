const homeControllers = require('../../controllers/home/homeControllers')
const pageController = require('../../controllers/home/pageController')
const router = require('express').Router()

router.get('/get-categorys',homeControllers.get_categorys)
router.get('/get-products',homeControllers.get_products)
router.get('/price-range-latest-product',homeControllers.price_range_product)
router.get('/query-products',homeControllers.query_products)
router.get('/product-details/:slug',homeControllers.product_details)

router.post('/customer/submit-review',homeControllers.submit_review)
router.get('/customer/get-reviews/:productId',homeControllers.get_reviews)

// Page data routes
router.get('/about-data', pageController.get_about_data)
router.get('/pricing-data', pageController.get_pricing_data)
router.get('/faq-data', pageController.get_faq_data)
  

module.exports = router 