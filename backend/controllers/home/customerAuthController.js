const customerModel = require('../../models/customerModel')
const { responseReturn } = require('../../utiles/response')
const bcrypt = require('bcrypt')
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel')
const {createToken} = require('../../utiles/tokenCreate')
const emailService = require('../../utiles/emailService')

class customerAuthController{

    customer_register = async(req,res) => {
        const {name, email, password } = req.body

        try {
            const customer = await customerModel.findOne({email}) 
            if (customer) {
                responseReturn(res, 404,{ error : 'Email Already Exits'} )
            } else {
                const createCustomer = await customerModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password, 10),
                    method: 'manually'
                })
                await sellerCustomerModel.create({
                    myId: createCustomer._id
                })
                const token = await createToken({
                    id : createCustomer._id,
                    name: createCustomer.name,
                    email: createCustomer.email,
                    method: createCustomer.method 
                })
                res.cookie('customerToken',token,{
                    expires : new Date(Date.now() + 7*24*60*60*1000 )
                })

                try {
                    await emailService.sendCustomerWelcomeEmail({
                        name: createCustomer.name,
                        email: createCustomer.email
                    });
                    await emailService.sendAdminCustomerNotification({
                        name: createCustomer.name,
                        email: createCustomer.email
                    });
                } catch (emailError) {
                    console.error('Email notification error:', emailError);
                }

                responseReturn(res,201,{message: "User Register Success", token})
            }
        } catch (error) {
            console.log('Registration error:', error.message)
            responseReturn(res, 500, { error: 'Server error occurred during registration' })
        }
    }

    customer_login = async(req, res) => {
       const { email, password } = req.body;
       try {
        const customer = await customerModel.findOne({email}).select('+password');
        if (customer) {
            const match = await bcrypt.compare(password, customer.password);
            if (match) {
                const token = await createToken({
                    id : customer._id,
                    name: customer.name,
                    email: customer.email,
                    method: customer.method 
                });
                res.cookie('customerToken',token,{
                    expires : new Date(Date.now() + 7*24*60*60*1000 )
                });
                responseReturn(res, 201,{ message :  'User Login Success',token});
            } else {
                responseReturn(res, 404,{ error :  'Password Wrong'});
            }
        } else {
            responseReturn(res, 404,{ error :  'Email Not Found'});
        }
       } catch (error) {
        console.error('Login error:', error);
        responseReturn(res, 500, { error: `Server error occurred during login: ${error.message}` });
       }
    }

  customer_logout = async(req, res) => {
    res.cookie('customerToken',"",{
        expires : new Date(Date.now())
    })
    responseReturn(res, 200,{ message :  'Logout Success'})
  }

}

module.exports = new customerAuthController()