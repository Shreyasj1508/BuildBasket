import { lazy } from "react";    
const Login = lazy(()=> import('../../views/auth/Login'))   
const Register = lazy(()=> import('../../views/auth/Register')) 
const AdminLogin = lazy(()=> import('../../views/auth/AdminLogin')) 
const Home = lazy(()=> import('../../views/Home'))   
const UnAuthorized = lazy(()=> import('../../views/UnAuthorized'))   
const Success = lazy(()=> import('../../views/Success'))
const Debug = lazy(()=> import('../../views/Debug'))   

const publicRoutes = [
    {
        path: '/',
        element : <Home/>, 
    },
    {
        path : '/login',
        element : <Login/>
    },
    {
        path : '/register',
        element : <Register/>
    },
    {
        path : '/admin/login',
        element : <AdminLogin/>
    },
    {
        path : '/unauthorized',
        element : <UnAuthorized/>
    },
    {
        path : '/success?',
        element : <Success/>
    },
    {
        path : '/debug',
        element : <Debug/>
    }
]

export default publicRoutes