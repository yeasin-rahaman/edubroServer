const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.24hkl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log('mogno:',uri);
const client = new MongoClient(uri, {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Edu-Bro");
    const allQuestionsCollection = database.collection("allQuestions");
    const allBooksCollection = database.collection("allBooks");
    const allBlogsCollection = database.collection("allBlogs");
    const allNotesCollection = database.collection("allNotes");
    const userCollection = database.collection("user");
    const questionSolveCollection = database.collection("questionSolve");
    const BlogCommentCollection = database.collection("BlogComment");



        // get question  solve

        app.get('/getBlogComment', async (req, res) => {

          const result = await BlogCommentCollection.find({}).toArray()
          res.send(result)
      })



   // post blog comment 
   app.post('/PostBlogComment', async (req, res) => {
    const BlogComment = req.body;
    const result = await BlogCommentCollection.insertOne(BlogComment);
    res.json(result);
    console.log(result)

  });








   // POST solve
   app.post('/addQuestionSolve', async (req, res) => {
    const questionSolve = req.body;
    const result = await questionSolveCollection.insertOne(questionSolve);
    res.json(result);
    console.log(result)

  });



        // get question  solve

        app.get('/questionSolve/${id}', async (req, res) => {
          const result = await questionSolveCollection.find({ questionId: req.params.id }).toArray()
          res.send(result)
      })



    // POST Question
    app.post('/postQuestion', async (req, res) => {
      const allQuestions = req.body;
      const result = await allQuestionsCollection.insertOne(allQuestions);
      res.json(result);
      console.log(result)

    });

    // Get all questions api 
    app.get("/allQuestions", async (req, res) => {
      const cursor = allQuestionsCollection.find({});
      const allQuestions = await cursor.toArray();
      res.send(allQuestions);
    });


    // get single questions
    app.get('/question/:id', async (req, res) => {
      const id = req.params.id;
      // @ts-ignore
      const result = await allQuestionsCollection.findOne({ _id: ObjectId(id) })
      res.json(result)
    })



    // POST Books
    app.post('/postBooks', async (req, res) => {
      const allBooks = req.body;
      const result = await allBooksCollection.insertOne(allBooks);
      res.json(result);
      console.log(result)

    });


    // Get all books api 
    app.get("/allBooks", async (req, res) => {
      const cursor = allBooksCollection.find({});
      const allBooks = await cursor.toArray();
      res.send(allBooks);
    });


    // blog update status 
    
    app.put("/BookStatusUpdate/:id", async (req, res) => {

      const filter = { _id: ObjectId(req.params.id) };

      const result = await allBooksCollection.updateOne(filter, {
          $set: {
              status: req.body.status,
          },
      });
      res.send(result);
  });




    // POST blogs
    app.post('/postBlogs', async (req, res) => {
      const allBlogs = req.body;
      const result = await allBlogsCollection.insertOne(allBlogs);
      res.json(result);
      console.log(result)

    });


    // Get all blogs api 
    app.get("/allBlogs", async (req, res) => {
      const cursor = allBlogsCollection.find({});
      const allBlogs = await cursor.toArray();
      res.send(allBlogs);
    });



    // get single blog
    app.get('/blog-details/:id', async (req, res) => {
      const id = req.params.id;
      // @ts-ignore
      const result = await allBlogsCollection.findOne({ _id: ObjectId(id) })
      res.json(result)
    })



    // blog update status 
    
    app.put("/BlogStatusUpdate/:id", async (req, res) => {

      const filter = { _id: ObjectId(req.params.id) };

      const result = await allBlogsCollection.updateOne(filter, {
          $set: {
              status: req.body.status,
          },
      });
      res.send(result);
  });


  
     


    // POST notes
    app.post('/postNotes', async (req, res) => {
      const allNotes = req.body;
      const result = await allNotesCollection.insertOne(allNotes);
      res.json(result);
      console.log(result)

    });

    // Get all notes api 
    app.get("/allNotes", async (req, res) => {
      const cursor = allNotesCollection.find({});
      const allNotes = await cursor.toArray();
      res.send(allNotes);
    });


    // blog update status 
    
    app.put("/notesStatusUpdate/:id", async (req, res) => {

      const filter = { _id: ObjectId(req.params.id) };

      const result = await allNotesCollection.updateOne(filter, {
          $set: {
              status: req.body.status,
          },
      });
      res.send(result);
  });







    // add user 
    app.post("/users", async (req, res) => {
      const result = await userCollection.insertOne(req.body);
      res.send(result);
      console.log(result)
    });

    // upsert for google login 
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email }
      const options = { upsert: true }
      const updateDoc = { $set: user }
      const result = await userCollection.updateOne(filter, updateDoc, options)
      res.json(result)
    })


    // update user
    app.put('/updateUser', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email }
      const updateDoc = {
        $set: {
          department: user.department,
          university: user.university
        }
      }
      const result = await userCollection.updateOne(filter, updateDoc)
      res.json(result)
    })

    // get single user
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const user = await userCollection.findOne(query)
      res.json(user)
    })



 // get my note

    app.get('/myQuestions/:email', async (req, res) => {
    const result = await allQuestionsCollection.find({ email: req.params.email }).toArray()
    res.send(result)
          })

          
 // // get my note

    app.get('/myNotes/:email', async (req, res) => {
    const result = await allNotesCollection.find({ email: req.params.email }).toArray()
    res.send(result)
          })


 // // get my Books

    app.get('/myBooks/:email', async (req, res) => {
    const result = await allBooksCollection.find({ email: req.params.email }).toArray()
    res.send(result)
          })


 // // get my blogs

    app.get('/myBlogs/:email', async (req, res) => {
    const result = await allBlogsCollection.find({ email: req.params.email }).toArray()
    res.send(result)
          })
    //MAKE ADMIN
    app.put('/users/admin', async(req, res)=>{
      const user = req.body;
      const filter = {email : user.email};
      const updateDoc = {$set:{role : 'admin'}};
      const result = await userCollection.updateOne(filter, updateDoc)
      res.json(result)
    })

    //ADMIN CONDITIONALLY RENDERED
    app.get('/users/:email', async(req, res) =>{
          const email = req.params.email;
          const query = {email: email};
          const user = await userCollection.findOne(query)
          let isAdmin = false;
          if(user?.role === 'admin'){
              isAdmin = true;
          }
          res.json({admin: isAdmin});
    })





  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running The Edu-Bro Server");
});

app.listen(port, () => {
  console.log("Running server is port", port);
});