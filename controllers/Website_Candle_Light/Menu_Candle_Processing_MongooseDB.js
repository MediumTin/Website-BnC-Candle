const User = require('../../model/User');
const Candle_Collection = require('../../model/Candle_Collection');

const bcrypt = require('bcrypt');

const GetAllProductInformation = async () => {
    var result =[];
    try{
        // Get all product information in Database
        result = await Candle_Collection.find({
            // username: "TrungTin_2"
        });
        // console.log('All_Docuemnt_InDB : ', result[0].name);

    } catch(err){
        // res.status(500).json({'message':err.message});
    }
    return result;
}

const AddNewProductInformation = async (name,type,group,brand,price,price_range,color,image) => {
    var List_Of_Product = await GetAllProductInformation();
    var length_of_DB = (List_Of_Product).length;
    try{
        const result = await Candle_Collection.create({
            "id":length_of_DB+1,
            "name": name,
            "type": type,
            "group": group,
            "brand": brand,
            "price": price,
            "price_range" : price_range,
            "color": color,
            "image": image
        })
        return 1;

    } catch(err){
        // res.status(400).json({'message':err.message});
        // result = "Failed";
        return 0;
    }
    
}

const FilterInfo = async (RequestType,RequestGroup,RequestBrand,RequestPrice,RequestColor) => {
    var List_Of_Product = await GetAllProductInformation();
    var length_of_DB = (List_Of_Product).length;
    var number_of_filtered=0;
    var NewRequestType_array = RequestType.split(",");
    var NewRequestGroup_array = RequestGroup.split(",");
    var NewRequestBrand_array = RequestBrand.split(",");
    var NewRequestPrice_array = RequestPrice.split(",");
    var NewRequestColor_array = RequestColor.split(",");
    var number_of_Type = (NewRequestType_array).length;
    var number_of_Group = (NewRequestGroup_array).length;
    var number_of_Brand = (NewRequestBrand_array).length;
    var number_of_Price = (NewRequestPrice_array).length;
    var number_of_Color = (NewRequestColor_array).length;
    var Condition_Type = 0;
    var Condition_Group = 0;
    var Condition_Brand = 0;
    var Condition_Price = 0;
    var Condition_Color = 0;
    var result =[];
    for(let i=0;i<length_of_DB;i++){
        for(let j=0;j<number_of_Type;j++){
            if(List_Of_Product[i].type == NewRequestType_array[j]){
                Condition_Type = 1;
            }
        }
        
        for(let j=0;j<number_of_Group;j++){
            if(List_Of_Product[i].group == NewRequestGroup_array[j]){
                Condition_Group = 1;
            }
        }
        for(let j=0;j<number_of_Brand;j++){
            if(List_Of_Product[i].brand == NewRequestBrand_array[j]){
                Condition_Brand = 1;
            }
        }
        for(let j=0;j<number_of_Price;j++){
            if(List_Of_Product[i].price_range == NewRequestPrice_array[j]){
                Condition_Price = 1;
            }
        }
        for(let j=0;j<number_of_Color;j++){
            if(List_Of_Product[i].color == NewRequestColor_array[j]){
                Condition_Color = 1;
            }
        }
        console.log(`Condition of ${List_Of_Product[i].name} : Type is ${Condition_Type} ; Group is ${Condition_Group} ; Brand is ${Condition_Brand} ; Price is ${Condition_Price} ; Color is ${Condition_Color}`);
        if(Condition_Type && Condition_Group && Condition_Brand && Condition_Price && Condition_Color){
            result[number_of_filtered] = List_Of_Product[i];
            number_of_filtered++; // correct result is (number_of_filtered-1)
        }
        Condition_Type = 0;
        Condition_Group = 0;
        Condition_Brand = 0;
        Condition_Price = 0;
        Condition_Color = 0;
    }
    // console.log("NewRequestGroup_array",length_of_DB);
    
    return result;
}

module.exports = {
    AddNewProductInformation,
    GetAllProductInformation,
    FilterInfo

};