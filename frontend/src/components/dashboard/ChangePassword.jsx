import React from 'react';

const ChangePassword = () => {
    return (
        <div className='p-4 bg-white'>
            <h2 className='text-xl text-slate-600 pb-5'>Change Password </h2>
        
        <form>
            <div className='flex flex-col gap-1 mb-2'>
                <label htmlFor="old_password">Old Password</label>
            <input className='input-field' type="password" name="old_password" id="old_password"  placeholder='Old Password'/>
            </div>

            <div className='flex flex-col gap-1 mb-2'>
                <label htmlFor="new_password">New Password</label>
            <input className='input-field' type="password" name="new_password" id="new_password"  placeholder='New Password'/>
            </div>

            <div className='flex flex-col gap-1 mb-2'>
                <label htmlFor="confirm_password">Confirm Password</label>
            <input className='input-field' type="password" name="confirm_password" id="confirm_password"  placeholder='Confirm Password'/>
            </div>
            <div>
                <button className='btn-primary'>Update Password</button>
            </div>


        </form>

        </div>
    );
};

export default ChangePassword;