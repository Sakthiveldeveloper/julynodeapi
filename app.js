var express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config()
const port =process.env.PORT||7700;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const cors = require('cors');
//to receive data from form 
app.use(bodyParser.urlencoded({
        extended: true
    }));
app.use(bodyParser.json());
app.use(cors());
//const mongourl = "mongodb://localhost:27017"
const mongourl = "mongodb+srv://edureka:1234@cluster0.t9dwc.mongodb.net/zomato?retryWrites=true&w=majority"

var db;
let col_name ="location"
let col_name1 ="restaurants"
//get
app.get('/',(req,res) => {
    res.send("Welcome to Node Api1")
})

//list of city
app.get('/location',(req,res) =>{
    db.collection(col_name).find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//List all restaurants
app.get('/restaurants',(req,res) =>{
    db.collection(col_name1).find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
//query example
// restarants with respect to quick search
app.get('/restaurant',(req,res) =>{
    var query = {}
    if(req.query.stateId){
        query={state_id:Number(req.query.stateId)}
    }else if(req.query.mealtype_id){
        query={"mealTypes.mealtype_id":Number(req.query.mealtype_id)}
    }
    db.collection(col_name1).find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
//https://zomatojulapi.herokuapp.com/restaurant?mealtype_id=1
// restarants with respect to quick search
/*
app.get('/restaurant',(req,res) =>{
    var query = {}
    if(req.query.cityId){
        query={city:req.query.cityId}
    }else if(req.query.mealtype){
        query={"type.mealtype":req.query.mealtype}
    }
    db.collection(col_name1).find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
*/
//filterapi
//(http://localhost:8210/filter/1?lcost=500&hcost=600)
app.get('/filter/:mealType',(req,res) => {
    var sort = {cost:1}
    var skip = 0;
    var limit= 1000000000000;
    if(req.query.sortkey){
        sort = {cost:req.query.sortkey}
    }
    if(req.query.skip && req.query.limit){
        skip = Number(req.query.skip);
        limit = Number(req.query.limit)
    }
    var mealType = req.params.mealType;
    var query = {"mealTypes.mealtype_id":Number(mealType)};
    if(req.query.cuisine && req.query.lcost && req.query.hcost){
        query={
            $and:[{cost:{$gt:Number(req.query.lcost),$lt:Number(req.query.hcost)}}],
            "cuisines.cuisine_id":Number(req.query.cuisine),
            "mealTypes.mealtype_id":Number(mealType)
        }
    }
    else if(req.query.cuisine){
        query = {"mealTypes.mealtype_id":Number(mealType),"cuisines.cuisine_id":Number(req.query.cuisine) }
    }
    else if(req.query.lcost && req.query.hcost){
        var lcost = Number(req.query.lcost);
        var hcost = Number(req.query.hcost);
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}],"mealTypes.mealtype_id":Number(mealType)}
    }
    db.collection(col_name1).find(query).sort(sort).skip(skip).limit(limit).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
/*
//filterapi
//(http://localhost:8210/filter/1?lcost=500&hcost=600)
app.get('/filter/:mealType',(req,res) => {
    var sort = {cost:1}
    var skip = 0;
    var limit= 1000000000000;
    if(req.query.sortkey){
        sort = {cost:req.query.sortkey}
    }
    if(req.query.skip && req.query.limit){
        skip = Number(req.query.skip);
        limit = Number(req.query.limit)
    }
    var mealType = req.params.mealType;
    var query = {"type.mealtype":mealType};
    if(req.query.cuisine && req.query.lcost && req.query.hcost){
        query={
            $and:[{cost:{$gt:Number(req.query.lcost),$lt:Number(req.query.hcost)}}],
            "Cuisine.cuisine":req.query.cuisine,
            "type.mealtype":mealType
        }
    }
    else if(req.query.cuisine){
        query = {"type.mealtype":mealType,"Cuisine.cuisine":req.query.cuisine }
    }
    else if(req.query.lcost && req.query.hcost){
        var lcost = Number(req.query.lcost);
        var hcost = Number(req.query.hcost);
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}],"type.mealtype":mealType}
    }
    db.collection(col_name1).find(query).sort(sort).skip(skip).limit(limit).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
*/
// query example
/*app.get('/restaurant',(req,res) =>{
    var mealType = req.query.mealType?req.query.mealType:"2";
    db.collection(col_name1).find({"type:mealType":mealType}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})*/
//list of quicksearch
app.get('/quicksearch',(req,res) =>{
    db.collection('mealtype').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})
// restaurant Details
//https://zomatojulapi.herokuapp.com/details/10
app.get('/details/:id',(req,res)=>{
    var id= req.params.id
    db.collection('restaurants').find({restaurant_id:Number(id)}).toArray((err, result) => {
        if(err) throw err;
        res.send(result)
    })
// restaurant Details
/*
app.get('/details/:id',(req,res)=>{
    var id= req.params.id
    db.collection('restaurants').find({_id:id},(err, result) => {
        if(err) throw err;
        res.send(result)
    })
    
        db.collection('res').findOne({_id:id},(err, result) => {
                if(err) throw err;
                res.send(result)
            })
 */
})
//menu Details
app.get('/menu/:id',(req,res)=>{
    var id= req.params.id
    db.collection('menu').find({restaurant_id:Number(id)}).toArray((err, result) => {
        if(err) throw err;
        res.send(result)
    })
})


//geting multiple data in a single 
//use postman
//working

app.post('/menuItem',(req, res) => {
    console.log(req.body)
    db.collection('menu').find({menu_id:{$in:req.body.ids}}).toArray((err, result) => {
        if(err) throw err;
        res.send(result)
    })
})

// place order
app.post('/placeOrder',(req, res) => {
    console.log(req.body);
    db.collection('orders').insert(req.body,(err,result) => {
        if (err) throw err;
        res.send("Order Placded")
    })
})


//view order
//able to find the order with user
app.get('/viewOrder',(req,res)=>{
    var query = {}
    if(req.query.email){
        query = {email:req.query.email}
    }
    db.collection('orders').find(query).toArray((err, result) => {
        if(err) throw err;
        res.send(result)
    })
})
/*
//view order
app.get('/viewOrder',(req,res)=>{
    db.collection('orders').find().toArray((err, result) => {
        if(err) throw err;
        res.send(result)
    })
})
*/
//view order with mongodb id
app.get('/viewOrder/:id',(req,res)=>{
    var id=mongo.ObjectId(req.params.id)
    db.collection('orders').find({_id:id}).toArray((err, result) => {
        if(err) throw err;
        res.send(result)
    })
})

//delete order
app.delete('/deleteOrder',(req,res)=>{
    db.collection('orders').remove({},(err, result) => {
        if(err) throw err;
        res.send(result)
    })
})

//order statu changed 

app.put('/updateStatus/:id',(req, res) => {
    var id = mongo.ObjectId(req.params.id);
    var status =  'pending';
    var statusVal = 2
    if(req.query.status){
        statusVal = Number(req.query.status)
        if(statusVal == 1){
            status = 'Accepted'
        }else if ( statusVal == 0 ){
            status ='Rejected'
        }else{
            status = 'Pending'
        }
    }
    db.collection('orders').updateOne(
        {_id:id},
        {
            $set: {
                "status" : status
            }
        },(err, result) => {
            if(err) throw err;
            res.send(`Your order status is ${status}`)
        }
    )
})

MongoClient.connect(mongourl, (err,client) => {
    if(err) console.log("Error While Connecting");
    db = client.db('zomato');
    app.listen(port,()=>{
        console.log(`listening on port no ${port}`)
    });     
})