const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const verifyJWT = (req,res,next)=>{
  const authorization=req.headers.authorization;
  if(!authorization){
    console.log(error.message)
    return res.status(401).send({message:"Invalid authorization"});
  }
  const token =authorization?.split(' ')[1];
  jwt.verify(token,process.env.ASSES_SECRET,(err,decoded)=>{
    if(err){
      return res.status(403 ).send({message:"Forbidden access"});
    }
    req.decoded=decoded;
    next();
  })
}

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@active-life.y0xkuj8.mongodb.net/?retryWrites=true&w=majority&appName=active-life`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectAndStartServer() {
  try {
    await client.connect();

    const database = client.db("active-life");
    const userCollection = database.collection("users");
    const userHealthRecordCollection = database.collection("userHealthRecords");
    const workoutCollection = database.collection("workouts");
    const dietCollection = database.collection("diets");
    const userWorkoutsCollection = database.collection("userWorkouts");
    const userDietsCollection = database.collection("userDiets");
    const userInstructorsCollection = database.collection("userInstructors");
    const instructorCollection = database.collection("instructors");

    app.post('/api/set-token',async(req,res)=>{
      const user=req.body;
      var token = jwt.sign(user,process.env.ASSES_SECRET,{
        expiresIn:'24h'
      });
      res.send({token});
    })

    //middleware for admin and instructor
    const verifyAdmin=async(req,res,next)=>{
      const email =req.decoded.email;
      const query ={email:email};
      const user=await userCollection.findOne(query);
      if(user.userName==='admin'){
        next();
      }else{
        return res.status(401).send({message:"Forbidden access"});
      }
    }

    //add new user
    app.post('/new-user', async (req, res) => {
      const newUser = req.body;

      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
     
    //display all the users
    app.get('/users', async(req,res)=>{
      //const query ={name:"ABC"}
      const result=await userCollection.find().toArray();
      res.send(result);
    })

    app.get('/users/:id',verifyJWT,async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result);
    })

    app.get('/user/:email',async(req,res)=>{
      const email=req.params.email;
      const query={email:email};
      const result = await userCollection.findOne(query);
      res.send(result);
    })

    app.delete('/delete-user/:id',verifyJWT,verifyAdmin,async(req,res)=>{
      const id=req.params.id;
      const query = {_id: new ObjectId(id)};
      const result=await userCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/update-userDetails/:id',async(req,res)=>{
      const id=req.params.id;
      const updateUser=req.body;
      const filter={_id: new ObjectId(id)};
      const options={upsert:true};
      const updateDoc={
        $set:{
          
            fullName:updateUser.fullName,
            gender:updateUser.gender, 
            email:updateUser.email, 
            age:updateUser.age, 
            address:updateUser.address, 
            userName:updateUser.userName, 
            password:updateUser.password,
            maritalStatus:updateUser.maritalStatus, 
            employmentStatus:updateUser.employmentStatus
        
        }
      };
      const result =await userCollection.updateOne(filter,updateDoc,options)
      res.send(result);
    })

    //add new diet
    app.post('/new-diet', verifyJWT,verifyAdmin,async (req, res) => {
      const newDiet = req.body;

      const result = await dietCollection.insertOne(newDiet);
      res.send(result);
    });

    //display all diets
    app.get('/diets', async(req,res)=>{
      const result=await dietCollection.find().toArray();
      res.send(result);
    })

    //get single diet
    app.get('/diets/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result = await dietCollection.findOne(query);
      res.send(result);
    })
    
    //update all diet details
    app.put('/update-diets/:id',verifyJWT,verifyAdmin,async(req,res)=>{
      const id=req.params.id;
      const updateDiet=req.body;
      const filter={_id: new ObjectId(id)};
      const options={upsert:true};
      const updateDoc={
        $set:{
          name:updateDiet.name,
          howItWorks:updateDiet.howItWorks,
          benefits:updateDiet.benefits,
          downsides:updateDiet.downsides
        }
      };
      const result =await dietCollection.updateOne(filter,updateDoc,options)
      res.send(result);
    })

    app.delete('/delete-diet/:id',verifyJWT,verifyAdmin,async(req,res)=>{
      const id=req.params.id;
      const query = {_id: new ObjectId(id)};
      const result=await dietCollection.deleteOne(query);
      res.send(result);
    })

    //add new workout
    app.post('/new-workout', verifyJWT,verifyAdmin,async (req, res) => {
      const newWorkout = req.body;

      const result = await workoutCollection.insertOne(newWorkout);
      res.send(result);
    });

    //display all workdouts
    app.get('/workouts', async(req,res)=>{
      const result=await workoutCollection.find().toArray();
      res.send(result);
    })

    //get single workout
    app.get('/workouts/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result = await workoutCollection.findOne(query);
      res.send(result);
    })

    app.put('/update-workouts/:id',verifyJWT,verifyAdmin,async(req,res)=>{
      const id=req.params.id;
      const updateWorkout=req.body;
      const filter={_id: new ObjectId(id)};
      const options={upsert:true};
      const updateDoc={
        $set:{
          name:updateWorkout.name,
          numberOfDays:parseInt(updateWorkout.numberOfDays),
          howToDo:updateWorkout.howToDo
        }
      };
      const result =await workoutCollection.updateOne(filter,updateDoc,options)
      res.send(result);
    })

    app.delete('/delete-workout/:id',verifyJWT,verifyAdmin,async(req,res)=>{
      const id=req.params.id;
      const query = {_id: new ObjectId(id)};
      const result=await workoutCollection.deleteOne(query);
      res.send(result);
    })

    //add new instructor
    app.post('/new-instructor', verifyJWT,verifyAdmin,async (req, res) => {
      const newInstructor = req.body;

      const result = await instructorCollection.insertOne(newInstructor);
      res.send(result);
    });

    //get single instructor
    app.get('/instructors/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result = await instructorCollection.findOne(query);
      res.send(result);
    })

    //display all instructors
    app.get('/instructors', async(req,res)=>{
      const result=await instructorCollection.find().toArray();
      res.send(result);
    })

    app.put('/update-instructors/:id',verifyJWT,verifyAdmin,async(req,res)=>{
      const id=req.params.id;
      const updateInstructor=req.body;
      const filter={_id: new ObjectId(id)};
      const options={upsert:true};
      const updateDoc={
        $set:{
          name:updateInstructor.name,
          email:updateInstructor.email,
          phoneNo:updateInstructor.phoneNo,
          qualification:updateInstructor.qualification,
          experience:updateInstructor.experience,
          specialities:updateInstructor.specialities
        }
      };
      const result =await instructorCollection.updateOne(filter,updateDoc,options)
      res.send(result);
    })

    app.delete('/delete-instructor/:id',verifyJWT,verifyAdmin,async(req,res)=>{
      const id=req.params.id;
      const query = {_id: new ObjectId(id)};
      const result=await instructorCollection.deleteOne(query);
      res.send(result);
    })

    //add workout to a user
    app.post('/new-userWorkout', async (req, res) => {
      const finishedDays = 0;
      const newUserWorkout = req.body;
      newUserWorkout.finishedDays = finishedDays;

      const result = await userWorkoutsCollection.insertOne(newUserWorkout);
      res.send(result);
    });
    
    //get single userWorkout
    app.get('/userWorkout/:id',async(req,res)=>{
      const id=req.params.id;
      const email =req.query.email;
      const query={workoutId:id, userEmail:email};
      const projection = {workoutId:1};
      const result = await userWorkoutsCollection.findOne(query,{projection:projection})
      res.send(result);
    })

    app.get('/userInstructor/:id',async(req,res)=>{
      const id=req.params.id;
      const email =req.query.email;
      const query={instructorId:id, userEmail:email};
      const projection = {instructorId:1};
      const result = await userInstructorsCollection.findOne(query,{projection:projection})
      res.send(result);
    })
    
    /*
    app.get('/userDiets-email/:email',async(req,res)=>{
      
      const email=req.params.email;
      const query={userEmail:email};
      //console.log(email)
      
      const pipeline=[
        {
          $match: query
        },
        {
          $lookup:{
            from:"diets",
            localField:"_id",
            foreignField:"dietId",
            as:"diets"
          }
        },
        {
          $unwind:"$diets"
        },
        {
          $lookup:{
            from:"users",
            localField:"diets.name",
            foreignField:"email",
            as:"dName"
          }
        },
        {
          $project:{
            _id:0,
            dName:{
              $arrayElemAt:["$dName",0]
            },
            diets:1
          }
        }
      ];
      const result = await userDietsCollection.aggregate(pipeline).toArray(); 
      //console.log(result)
      res.send(result);
    })
    */

    /*
    app.get('/userWorkouts-email/:email',async(req,res)=>{
      
      const email=req.params.email;
      const query={userEmail:email};
      
      const pipeline=[
        {
          $match: query
        },
        {
          $lookup:{
            from:"workouts",
            localField:"_id",
            foreignField:"workoutId",
            as:"workouts"
          }
        },
        {
          $unwind:"$workouts"
        },
        {
          $lookup:{
            from:"users",
            localField:"workouts.name",
            foreignField:"email",
            as:"wName"
          }
        },
        {
          $project:{
            _id:0,
            dName:{
              $arrayElemAt:["$wName",0]
            },
            workouts:1
          }
        }
      ];
      const result = await userWorkoutsCollection.aggregate(pipeline).toArray(); 
      //console.log(result)
      res.send(result);
    })*/

    //display workouts that each user has added to profile
    app.get('/userWorkouts', async(req,res)=>{
      const result=await userWorkoutsCollection.find().toArray();
      res.send(result);
    })

    //update number of days finished in workouts
    app.patch('/update-userWorkoutDays/:id',async(req,res)=>{
      const id=req.params.id;
      const days=req.body.finishedDays;
      const filter={_id:new ObjectId(id)};
      const options={upsert:true};
      const updateDoc={
        $set:{
          finishedDays:days
        }
      }
      const result = await userWorkoutsCollection.updateOne(filter,updateDoc,options);
      res.send(result);
    })

    app.delete('/delete-userWorkout/:id',async(req,res)=>{
      const id=req.params.id;
      const query = {_id: new ObjectId(id)};
      const result=await userWorkoutsCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/userInstructors', async(req,res)=>{
      const result=await userInstructorsCollection.find().toArray();
      res.send(result);
    })

    app.delete('/delete-userInstructor/:id',async(req,res)=>{
      const id=req.params.id;
      const query = {_id: new ObjectId(id)};
      const result=await userInstructorsCollection.deleteOne(query);
      res.send(result);
    });

    app.post('/new-userInstructor', async (req, res) => {
      const newUserInstructor = req.body;
      const result = await userInstructorsCollection.insertOne(newUserInstructor);
      res.send(result);
    });

    //add diet to a user
    app.post('/new-userDiet', async (req, res) => {
      const newUserDiet = req.body;

      const result = await userDietsCollection.insertOne(newUserDiet);
      res.send(result);
    });
    
    //get single userDiet
    app.get('/userDiet/:id',async(req,res)=>{
      const id=req.params.id;
      const email =req.query.email;
      const query={dietId:id, userEmail:email};
      const projection = {dietId:1};
      const result = await userDietsCollection.findOne(query,{projection:projection})
      res.send(result);
    })
    /*
    app.get('/userDiet-cartEmail/:email',async(req,res)=>{
      const email=req.params.email;
      const query={userEmail:email};
      const projection = {dietId:1};
      const userDiets = await userDietsCollection.find(query,{projection:projection}).toArray();
      const dietIds = userDiets.map(userDiet=>new ObjectId(userDiet.dietId))
      const query2 = {_id:{$in:dietIds}};
      const result = await userDietsCollection.find(query2).toArray();
      res.send(result);
    })*/

    //display diets that each user has added to profile
    app.get('/userDiets', async(req,res)=>{
      const result=await userDietsCollection.find().toArray();
      res.send(result);
    })
  
    app.delete('/delete-userDiet/:id',async(req,res)=>{
      const id=req.params.id;
      const query = {_id: new ObjectId(id)};
      const result=await userDietsCollection.deleteOne(query);
      res.send(result);
    })

    //user Health Record 
    app.post('/new-userHealthRecord', async (req, res) => {
      const newRecord = req.body;

      const result = await userHealthRecordCollection.insertOne(newRecord);
      res.send(result);
    });

    app.put('/update-userHRecord/:id',async(req,res)=>{
      const id=req.params.id;
      const updateRecord=req.body;
      const filter={_id: new ObjectId(id)};
      const options={upsert:true};
      const updateDoc={
        $set:{
          
          email:updateRecord.email,
          weight:updateRecord.weight,
          height:updateRecord.height,
          averageHeartRate:updateRecord,averageHeartRate,
          bloodPressure:updateRecord.bloodPressure,
          existingMedicalCondition:updateRecord.existingMedicalCondition,
          anySurgeries:updateRecord.anySurgeries,
          currentLevelofPhysicalActivity:updateRecord.currentLevelofPhysicalActivity,
          fitnessGoals:updateRecord.fitnessGoals,
          AnyAllergies:updateRecord.AnyAllergies,
          stressScale:updateRecord.stressScale,
          sleepHours:updateRecord.sleepHours
        
        }
      };
      const result =await userHealthRecordCollection.updateOne(filter,updateDoc,options)
      res.send(result);
    })

    app.get('/',(req,res)=>{
      res.send('Active Life Server is running!!')
    })

    //DB Connect
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectAndStartServer();
