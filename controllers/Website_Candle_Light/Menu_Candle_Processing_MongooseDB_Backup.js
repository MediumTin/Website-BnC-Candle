const User = require('../../model/User');

// const usersDB = {
//     users: require('../../model/Simulated_Database.json'),
//     setUsers: function(data) {
//         this.users = data
//     }
// }

// const fsPromises = require('fs').promises;
// const path = require('path');
const bcrypt = require('bcrypt');


// const FilterInfo = (RequestType,RequestGroup,RequestBrand,RequestPrice,RequestColor) => {
//     var length_of_DB = (usersDB.users).length;
//     var result =[];
//     var number_of_filtered=0;
//     var NewRequestType_array = RequestType.split(",");
//     var NewRequestGroup_array = RequestGroup.split(",");
//     var NewRequestBrand_array = RequestBrand.split(",");
//     var NewRequestPrice_array = RequestPrice.split(",");
//     var NewRequestColor_array = RequestColor.split(",");
//     var number_of_Type = (NewRequestType_array).length;
//     var number_of_Group = (NewRequestGroup_array).length;
//     var number_of_Brand = (NewRequestBrand_array).length;
//     var number_of_Price = (NewRequestPrice_array).length;
//     var number_of_Color = (NewRequestColor_array).length;
//     var Condition_Type = 0;
//     var Condition_Group = 0;
//     var Condition_Brand = 0;
//     var Condition_Price = 0;
//     var Condition_Color = 0;
//     for(let i=0;i<length_of_DB;i++){
//         for(let j=0;j<number_of_Type;j++){
//             if(usersDB.users[i].type == NewRequestType_array[j]){
//                 Condition_Type = 1;
//             }
//         }
        
//         for(let j=0;j<number_of_Group;j++){
//             if(usersDB.users[i].group == NewRequestGroup_array[j]){
//                 Condition_Group = 1;
//             }
//         }
//         for(let j=0;j<number_of_Brand;j++){
//             if(usersDB.users[i].brand == NewRequestBrand_array[j]){
//                 Condition_Brand = 1;
//             }
//         }
//         for(let j=0;j<number_of_Price;j++){
//             if(usersDB.users[i].price_range == NewRequestPrice_array[j]){
//                 Condition_Price = 1;
//             }
//         }
//         for(let j=0;j<number_of_Color;j++){
//             if(usersDB.users[i].color == NewRequestColor_array[j]){
//                 Condition_Color = 1;
//             }
//         }
//         console.log(`Condition of ${usersDB.users[i].name} : Type is ${Condition_Type} ; Group is ${Condition_Group} ; Brand is ${Condition_Brand} ; Price is ${Condition_Price} ; Color is ${Condition_Color}`);
//         if(Condition_Type && Condition_Group && Condition_Brand && Condition_Price && Condition_Color){
//             result[number_of_filtered] = usersDB.users[i];
//             number_of_filtered++; // correct result is (number_of_filtered-1)
//         }
//         Condition_Type = 0;
//         Condition_Group = 0;
//         Condition_Brand = 0;
//         Condition_Price = 0;
//         Condition_Color = 0;
//     }
//     console.log("NewRequestGroup_array",NewRequestGroup_array);
    
//     return result;
// }

const FilterInfo = async (RequestType,RequestGroup,RequestBrand,RequestPrice,RequestColor) => {
    // var length_of_DB = (usersDB.users).length;
    var result =[];
    // var number_of_filtered=0;
    // var NewRequestType_array = RequestType.split(",");
    // var NewRequestGroup_array = RequestGroup.split(",");
    // var NewRequestBrand_array = RequestBrand.split(",");
    // var NewRequestPrice_array = RequestPrice.split(",");
    // var NewRequestColor_array = RequestColor.split(",");
    // var number_of_Type = (NewRequestType_array).length;
    // var number_of_Group = (NewRequestGroup_array).length;
    // var number_of_Brand = (NewRequestBrand_array).length;
    // var number_of_Price = (NewRequestPrice_array).length;
    // var number_of_Color = (NewRequestColor_array).length;
    // var Condition_Type = 0;
    // var Condition_Group = 0;
    // var Condition_Brand = 0;
    // var Condition_Price = 0;
    // var Condition_Color = 0;
    // for(let i=0;i<length_of_DB;i++){
    //     for(let j=0;j<number_of_Type;j++){
    //         if(usersDB.users[i].type == NewRequestType_array[j]){
    //             Condition_Type = 1;
    //         }
    //     }
        
    //     for(let j=0;j<number_of_Group;j++){
    //         if(usersDB.users[i].group == NewRequestGroup_array[j]){
    //             Condition_Group = 1;
    //         }
    //     }
    //     for(let j=0;j<number_of_Brand;j++){
    //         if(usersDB.users[i].brand == NewRequestBrand_array[j]){
    //             Condition_Brand = 1;
    //         }
    //     }
    //     for(let j=0;j<number_of_Price;j++){
    //         if(usersDB.users[i].price_range == NewRequestPrice_array[j]){
    //             Condition_Price = 1;
    //         }
    //     }
    //     for(let j=0;j<number_of_Color;j++){
    //         if(usersDB.users[i].color == NewRequestColor_array[j]){
    //             Condition_Color = 1;
    //         }
    //     }
    //     console.log(`Condition of ${usersDB.users[i].name} : Type is ${Condition_Type} ; Group is ${Condition_Group} ; Brand is ${Condition_Brand} ; Price is ${Condition_Price} ; Color is ${Condition_Color}`);
    //     if(Condition_Type && Condition_Group && Condition_Brand && Condition_Price && Condition_Color){
    //         result[number_of_filtered] = usersDB.users[i];
    //         number_of_filtered++; // correct result is (number_of_filtered-1)
    //     }
    //     Condition_Type = 0;
    //     Condition_Group = 0;
    //     Condition_Brand = 0;
    //     Condition_Price = 0;
    //     Condition_Color = 0;
    // }
    // console.log("NewRequestGroup_array",NewRequestGroup_array);
    try{
        const result = await User.create({
            "username" : "TrungTin_3",
            "password" : "04092001"
        })

        // Get one persion as same as with found information
        // const userRessult = await User.findOne({
        //     username: "TrungTin_2"
        //   });
        

        // Get all information in Database
        const userRessult2 = await User.find({
            // username: "TrungTin_2"
          });
        console.log('All_Docuemnt_InDB : ', userRessult2);

    } catch(err){
        // res.status(500).json({'message':err.message});
    }
    // return result;
}

module.exports = {
    // User,
    FilterInfo

};