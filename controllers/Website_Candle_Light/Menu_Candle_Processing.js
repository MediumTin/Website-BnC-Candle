const usersDB = {
    users: require('../../model/Simulated_Database.json'),
    setUsers: function(data) {
        this.users = data
    }
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const Result = async (req,res) =>{
    const {user, pwd} = req.body;
    if (!user || !pwd) return res.status(400).json({'message':'Username and password are required.'});
    // check for duplicate usernames in the db
    const duplicate = usersDB.users.find(person => person.username === user);
    // const duplicate = 0;
    if (duplicate) return res.sendStatus(409); // conflictssss
    try{
        // encrypt the password
        const hasedPwd = await bcrypt.hash(pwd,10);
        //store the new user
        const newUser = {"username":user, "password":hasedPwd};
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname,'..','model','users.json'),
            JSON.stringify(usersDB.users)
        );
        console.log(usersDB.users);
        res.status(201).json({'success':`New user ${user} created`});    
    } catch(err){
        res.status(500).json({'message':err.message});
    }
}

const FilterInfo = (RequestType,RequestGroup,RequestBrand,RequestPrice,RequestColor) => {
    var length_of_DB = (usersDB.users).length;
    var result =[];
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
    for(let i=0;i<length_of_DB;i++){
        for(let j=0;j<number_of_Type;j++){
            if(usersDB.users[i].type == NewRequestType_array[j]){
                Condition_Type = 1;
            }
        }
        
        for(let j=0;j<number_of_Group;j++){
            if(usersDB.users[i].group == NewRequestGroup_array[j]){
                Condition_Group = 1;
            }
        }
        for(let j=0;j<number_of_Brand;j++){
            if(usersDB.users[i].brand == NewRequestBrand_array[j]){
                Condition_Brand = 1;
            }
        }
        for(let j=0;j<number_of_Price;j++){
            if(usersDB.users[i].price_range == NewRequestPrice_array[j]){
                Condition_Price = 1;
            }
        }
        for(let j=0;j<number_of_Color;j++){
            if(usersDB.users[i].color == NewRequestColor_array[j]){
                Condition_Color = 1;
            }
        }
        console.log(`Condition of ${usersDB.users[i].name} : Type is ${Condition_Type} ; Group is ${Condition_Group} ; Brand is ${Condition_Brand} ; Price is ${Condition_Price} ; Color is ${Condition_Color}`);
        if(Condition_Type && Condition_Group && Condition_Brand && Condition_Price && Condition_Color){
            result[number_of_filtered] = usersDB.users[i];
            number_of_filtered++; // correct result is (number_of_filtered-1)
        }
        Condition_Type = 0;
        Condition_Group = 0;
        Condition_Brand = 0;
        Condition_Price = 0;
        Condition_Color = 0;
    }
    console.log("NewRequestGroup_array",NewRequestGroup_array);
    
    return result;
}
const getAllCollection = (req,res)=>{
    res.json(usersDB.users);
}
module.exports = {
    usersDB,
    FilterInfo

};