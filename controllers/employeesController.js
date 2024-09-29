
// create linking to json file as object (stand for database), to read and write to database
const data = {
    employees : require('../model/employees.json'), // first key is database
    setEmployees: function(data){ // second key is function
        this.employees = data;
    }
};

const getAllEmployees = (req,res)=>{
    res.json(data.employees);
}

const createNewEmployee = (req,res)=>{
    const newEmployee = {
        id: data.employees[data.employees.length - 1].id + 1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    
    if(!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({'message':'First and last names are required'});
    }

    data.setEmployees([...data.employees,newEmployee]); // ... to return set new employee is equal level with ole employee
    res.status(201).json(data.employees);
}

const updateEmployee = (req,res)=>{
    /*
    Step 1: Find requested ID into current database
        + If ID is available, will proceed for udpate
        + If ID is not available, will give a message to warning and stop update
    Step 2: Read information in requested ID
    Step 3: Update firstname or lastname (if requested info is fullfil)
     */
    let isIDAvailable = 0; 
    let OderityFoundID = {};
    for(let i=0;i<data.employees.length;i++){
        isIDAvailable = data.employees[i].id === parseInt(req.body.id)
        if(isIDAvailable){
            OderityFoundID = i;
            break;
        }
    }
    if(data.employees[OderityFoundID]){
        if(req.body.firstname){
            data.employees[OderityFoundID].firstname = req.body.firstname;
        }
        if(req.body.lastname){
            data.employees[OderityFoundID].lastname = req.body.lastname;
        }
        
        res.status(201).json(data.employees);
    }
    else {
        res.status(400).json({'message':'ID is not available in database. Please ad new for it!'});
    }

}
const deleteEmployee = (req,res)=>{
    let isIDAvailable = 0; 
    let OderityFoundID = {};
    for(let i=0;i<data.employees.length;i++){
        isIDAvailable = data.employees[i].id === parseInt(req.body.id)
        if(isIDAvailable){
            OderityFoundID = i;
            break;
        }
    }
    // console.log(data.employees.length);
    if(data.employees[OderityFoundID]){ 
        let TemporaryArray = [];
        for(let i=0;i<data.employees.length-1;i++){
            if(i<OderityFoundID){
                TemporaryArray[i] = data.employees[i];
            }
            else {
                data.employees[i+1].id = data.employees[i+1].id-1;
                TemporaryArray[i] = data.employees[i+1];
            }
            // console.log(TemporaryArray[i]);
        }
        data.setEmployees(TemporaryArray);
        res.status(201).json(data.employees);
    }
    else {
        res.status(400).json({'message':'ID is not available in database. It cannot be deleted'});
    }
}

const getEmployee = (req,res)=>{
    let isIDAvailable = 0; 
    let OderityFoundID = {};
    for(let i=0;i<data.employees.length;i++){
        isIDAvailable = data.employees[i].id === parseInt(req.body.id)
        if(isIDAvailable){
            OderityFoundID = i;
            break;
        }
    }
    if(data.employees[OderityFoundID]){ 
        res.status(201).json(data.employees[OderityFoundID]);
    }
    else {
        res.status(400).json({'message':'ID is not available in database. It cannot be deleted'});
    }
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}