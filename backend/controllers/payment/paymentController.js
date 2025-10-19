const sellerModel = require('../../models/sellerModel')
const stripeModel = require('../../models/stripeModel')

const sellerWallet = require('../../models/sellerWallet')
const withdrowRequest = require('../../models/withdrowRequest') 

const {v4: uuidv4} = require('uuid')
const { responseReturn } = require('../../utiles/response')
const { mongo: {ObjectId}} = require('mongoose')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


class paymentController{

    create_stripe_connect_account = async(req,res) => {
        const {id} = req 
        const uid = uuidv4()

    try {
        const stripeInfo = await stripeModel.findOne({ sellerId: id  })

        if(stripeInfo){
            responseReturn(res, 200, { stripeInfo })
        }else{
            const account = await stripe.accounts.create({
                type: 'express',
                country: 'IN',
                email: req.body.email,
                capabilities: {
                    card_payments: {requested: true},
                    transfers: {requested: true},
                },
            })

            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: `${process.env.FRONTEND_URL}/seller/dashboard`,
                return_url: `${process.env.FRONTEND_URL}/seller/dashboard`,
                type: 'account_onboarding',
            })

            await stripeModel.create({
                sellerId: id,
                stripeAccountId: account.id,
                stripeAccountLink: accountLink.url
            })

            responseReturn(res, 200, { 
                stripeAccountLink: accountLink.url,
                stripeAccountId: account.id
            })
        }
    } catch (error) {
        responseReturn(res, 500, { error: error.message })
    }
    }

    get_stripe_account_status = async(req,res) => {
        const {id} = req 

        try {
            const stripeInfo = await stripeModel.findOne({ sellerId: id  })

            if(stripeInfo){
                const account = await stripe.accounts.retrieve(stripeInfo.stripeAccountId)
                
                responseReturn(res, 200, { 
                    stripeInfo,
                    accountStatus: account.details_submitted,
                    chargesEnabled: account.charges_enabled,
                    payoutsEnabled: account.payouts_enabled
                })
            }else{
                responseReturn(res, 404, { error: 'Stripe account not found' })
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    create_payment_intent = async(req,res) => {
        const { amount, currency = 'inr', orderId } = req.body

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount * 100, // Convert to paise
                currency,
                metadata: {
                    orderId: orderId
                }
            })

            responseReturn(res, 200, { 
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    confirm_payment = async(req,res) => {
        const { paymentIntentId } = req.body

        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
            
            if(paymentIntent.status === 'succeeded'){
                responseReturn(res, 200, { 
                    message: 'Payment successful',
                    paymentIntent: paymentIntent
                })
            }else{
                responseReturn(res, 400, { 
                    error: 'Payment not completed',
                    status: paymentIntent.status
                })
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    create_transfer = async(req,res) => {
        const { sellerId, amount, orderId } = req.body

        try {
            const stripeInfo = await stripeModel.findOne({ sellerId })
            
            if(!stripeInfo){
                return responseReturn(res, 404, { error: 'Seller stripe account not found' })
            }

            const transfer = await stripe.transfers.create({
                amount: amount * 100, // Convert to paise
                currency: 'inr',
                destination: stripeInfo.stripeAccountId,
                metadata: {
                    orderId: orderId,
                    sellerId: sellerId
                }
            })

            // Update seller wallet
            await sellerWallet.findOneAndUpdate(
                { sellerId },
                { $inc: { balance: amount } },
                { upsert: true }
            )

            responseReturn(res, 200, { 
                message: 'Transfer successful',
                transfer: transfer
            })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_seller_wallet = async(req,res) => {
        const {id} = req

        try {
            const wallet = await sellerWallet.findOne({ sellerId: id })
            
            if(!wallet){
                await sellerWallet.create({
                    sellerId: id,
                    balance: 0
                })
                return responseReturn(res, 200, { 
                    wallet: { sellerId: id, balance: 0 }
                })
            }

            responseReturn(res, 200, { wallet })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    create_withdraw_request = async(req,res) => {
        const {id} = req
        const { amount, bankDetails } = req.body

        try {
            const wallet = await sellerWallet.findOne({ sellerId: id })
            
            if(!wallet || wallet.balance < amount){
                return responseReturn(res, 400, { error: 'Insufficient balance' })
            }

            const withdrawRequest = await withdrowRequest.create({
                sellerId: id,
                amount,
                bankDetails,
                status: 'pending'
            })

            responseReturn(res, 201, { 
                message: 'Withdrawal request created',
                withdrawRequest
            })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_withdraw_requests = async(req,res) => {
        const {id} = req

        try {
            const requests = await withdrowRequest.find({ sellerId: id })
                .sort({ createdAt: -1 })

            responseReturn(res, 200, { requests })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    // Additional methods for compatibility
    active_stripe_connect_account = async(req,res) => {
        try {
            responseReturn(res, 200, { message: 'Stripe account activated' })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_seller_payment_details = async(req,res) => {
        try {
            const { sellerId } = req.params
            const wallet = await sellerWallet.findOne({ sellerId })
            responseReturn(res, 200, { wallet })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    withdrowal_request = async(req,res) => {
        try {
            const {id} = req
            const { amount, bankDetails } = req.body

            const wallet = await sellerWallet.findOne({ sellerId: id })
            
            if(!wallet || wallet.balance < amount){
                return responseReturn(res, 400, { error: 'Insufficient balance' })
            }

            const withdrawRequest = await withdrowRequest.create({
                sellerId: id,
                amount,
                bankDetails,
                status: 'pending'
            })

            responseReturn(res, 201, { 
                message: 'Withdrawal request created',
                withdrawRequest
            })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    get_payment_request = async(req,res) => {
        try {
            const requests = await withdrowRequest.find().sort({ createdAt: -1 })
            responseReturn(res, 200, { requests })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }

    payment_request_confirm = async(req,res) => {
        try {
            const { requestId, status } = req.body
            
            const request = await withdrowRequest.findByIdAndUpdate(
                requestId,
                { status },
                { new: true }
            )
            
            if (status === 'approved') {
                await sellerWallet.findOneAndUpdate(
                    { sellerId: request.sellerId },
                    { $inc: { balance: -request.amount } }
                )
            }
            
            responseReturn(res, 200, { 
                message: 'Payment request updated',
                request
            })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
}

module.exports = new paymentController()
