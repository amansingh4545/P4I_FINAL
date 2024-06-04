const path=require("path");
const express= require("express");
const Register=require("./models/registers");
const contactus=require("./models/contactus");
const Todo = require("./models/todos");
const app= express();
let allCB=[];

const mongoose=require("mongoose");

require("./db/conn");

const port= process.env.PORT || 8000;

const {json} = require("express");
const { trace } = require("console");

const staticPath= path.join(__dirname,"../public");

app.set("view engine","ejs");

app.use(express.static(staticPath));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req,res)=>{
    res.render("register");
});

var lobhai="guest@gmail.com";

app.get("/index", async(req,res)=>{
    const allTodo = await Todo.find({email: lobhai});
    const allCB = await CheckboxData.findOne({ email: lobhai });
    res.render("index", {todo: allTodo , defmail: lobhai , CBoptions: allCB})
});

app.get("/login", (req,res)=>{
    res.render("login");
});
app.post("/login", async (req,res)=>{
    try{
        const email=req.body.mail;
        const password=req.body.pass;
        const userdata = await Register.findOne({email:email});
        if(userdata.password === password){
            const allTodo = await Todo.find({email: email});
            const allCB = await CheckboxData.findOne({ email: email });
            res.status(201).render("index", {todo: allTodo , defmail: email , CBoptions: allCB });
        }else{
            res.status(400).send("Password do not match");
        }

    }catch(error){ 
        res.status(400).send("Entered email is wrong");
    }
});

app.post("/", async (req,res)=>{
     try{
        const password=req.body.password;
        const cpassword=req.body.confirm;

        var tracemail=req.body.email;
        const userdata = await Register.findOne({ email: tracemail });
        if(userdata){
            res.send("Already registered! please login to proceed further");
        }else{
            if(password===cpassword){
                const registerEmployee = new Register({
                    fullname: req.body.fullname,
                    username:req.body.username,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: req.body.password,
                })
                const registered=registerEmployee.save(); 
                const allTodo = await Todo.find({email: tracemail});
                const allCB = await CheckboxData.findOne({ email: tracemail });
                res.status(201).render("index", {todo: allTodo , defmail: tracemail , CBoptions: allCB });
            }else{
                res.send("password and cpassword must be same");
            }
        }
     }catch(error){
        res.send(error);
     }
});


app.post("/index", async (req,res)=>{
    try{
       const registerEmployee = new contactus({
           fname: req.body.fname,
           lname:req.body.lname,
           email: req.body.email,
           phone: req.body.phone,
           message: req.body.message,
       })

       const registered=registerEmployee.save();
       res.render("index");
    }catch(error){
       res.send(error);
    }
});


app.post("/add/todo", async(req, res) => {
    // const {todo} = req.body;
    const todo= req.body.todo;
    const email= req.body.regmail;
    const newTodo = new Todo({ email,todo });
    lobhai=email;

    // save the todo
    newTodo
      .save()
      .then(() => {
        // redirect karne par app.get("/index") wala pe jayega aur waha se render hoga.... wahi pe render karne par direct chala jata hai
        res.redirect("/index");
      })
      .catch((err) => console.log(err));
  })

  .get("/delete/todo/:_id", (req, res) => {
    const { _id } = req.params;
    Todo.deleteOne({ _id })
      .then(() => {
        res.redirect("/index");
      })
      .catch((err) => console.log(err));
  });



//checkboxes

const checkboxSchema = new mongoose.Schema({
    options: [String],
    email: {
        type: String,
      },
});

const CheckboxData = mongoose.model('CheckboxData', checkboxSchema);

app.post('/CBsubmit', async (req, res) => {
    const selectedOptions = req.body.options;
    const email= req.body.regmail;
    const CBpresent = await CheckboxData.findOne({ email: email });

    if (CBpresent) {
        await CheckboxData.deleteOne({ email: email }); // Use await here nhi to bc delete hone se pahle
        // agla wala save ho jata aur ye delete bhi nhi hota
    }

    const checkboxData = new CheckboxData({
      options: Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions],
      email: email
    });
    await checkboxData.save();
    // res.send('Data saved successfully!');
    res.redirect("/index");
});

//script code in ejs will request array of checkboxes from this function and will use it in script.
app.get('/data', async function(req, res) {
    //abhi dikkat ye hai ki checkbox wala kisi bhi mail se login kare value hamesha guest wala hi dikhayega
    const allCB = await CheckboxData.findOne({ email: lobhai });
    if(allCB){
        res.json({ dataArray: allCB.options });
    }
});

app.listen(port,()=>{
    console.log("Chalu Ho Gaya");
});
