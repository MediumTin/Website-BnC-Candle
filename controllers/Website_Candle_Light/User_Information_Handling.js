const User_Information = require('../../model/User_Information');
const bcrypt = require('bcrypt');

const Check_Valid_User_in_Database = async(username_request, password_request) => {
    var isValidUser = 0, isValidAdminRight = 0;
    var result = [];
    try{
        result = await User_Information.find({
            username: username_request,
            password: password_request
        });
        console.log('User is : ', result);

    } catch(err){
        // res.status(500).json({'message':err.message});
    }
    if(result.length != 0){
        isValidUser = 1;
        // Check valid admin right
        if(username_request == "Nguyen Trung Tin"){
            isValidAdminRight = 1;
            console.log("Valid admin right");
        }
    };
    console.log('Result of User finding is : ', isValidUser);
    return [isValidUser, isValidAdminRight];
}

const Check_All_user = async() => {
    var result = [];
    try{
        result = await User_Information.find({});
        console.log('User is : ', result);
    } catch(err){
        // res.status(500).json({'message':err.message});
    }
    return result;
}

const Add_New_User_Information = async(username_register, email_register, password_register, confirmed_password_register) => {
    var Result_Checking= 0;
    try{
        const result = await User_Information.create({
            "username": username_register,
            "password": password_register,
            "email": email_register,
        })
        Result_Checking = 1;

    } catch(err){
        // res.status(400).json({'message':err.message});
        // result = "Failed";
    }
    return Result_Checking;
}

module.exports = {
    Check_Valid_User_in_Database, 
    Add_New_User_Information, 
    Check_All_user
};