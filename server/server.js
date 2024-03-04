require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')    
const cors = require("cors")

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

//app.use(cors())
app.use(express.json())


const expressGraphQL = require('express-graphql').graphqlHTTP
const {  
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')

const Employee = require('./models/employeeModel')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


const EmployeeType = new GraphQLObjectType({
    name: 'Employee',
    description: 'This represents a employee to the app',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      employeeId: { type: GraphQLNonNull(GraphQLString) },
      position: { type: GraphQLNonNull(GraphQLString) },
      department: { type: GraphQLNonNull(GraphQLString) },
      salary:{ type: GraphQLNonNull(GraphQLInt) },
      name: { type: GraphQLNonNull(GraphQLString) },
      email:{ type: GraphQLNonNull(GraphQLString) },      
    })
  })

  const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      employee: {
        type: EmployeeType,
        description: 'A Single Employee',
        args: {
          _id: { type: GraphQLString }
        },
        resolve: async (parent, args) => {
            let employee
            employee = await Employee.findById(args._id)
           return employee;

        }
      },
      employees: {
        type: new GraphQLList(EmployeeType),
        description: 'List of All Employees',
        resolve: async () => {
           const employees = await Employee.find();
            return employees;         
        }
      }
    })
  })

  const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
      addEmployee: {
        type: EmployeeType,
        description: 'Add a employee',
        args: {
          employeeId: { type: GraphQLNonNull(GraphQLString) },
          position: { type: GraphQLNonNull(GraphQLString) },
          department: { type: GraphQLNonNull(GraphQLString) },
          salary:{ type: GraphQLNonNull(GraphQLInt) },
          name: { type: GraphQLNonNull(GraphQLString) },
          email:{ type: GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, args) => {
          const employee = new Employee({
            employeeId: args.employeeId,
            position: args.position,
            department: args.department,
            salary: args.salary,
            name: args.name,
            email: args.email,
            major: args.major+" centennial",
            //year: Number(args.year),
            //age: Number(args.age)
          });
          const newEmployee = await employee.save();
          return newEmployee;

        }
      },
      updateEmployee: {
        type: EmployeeType,
        description: 'Update a employee by ID',
        args: {
          _id: { type: GraphQLNonNull(GraphQLString) },
          name: { type: GraphQLNonNull(GraphQLString) },
          email:{ type: GraphQLNonNull(GraphQLString) },
          age:{ type: GraphQLNonNull(GraphQLInt) },
          major:{ type: GraphQLNonNull(GraphQLString) },
          year:{ type: GraphQLNonNull(GraphQLInt) }
        },
        //resolve: async (parent, { _id, input }) => {
          resolve: async (parent, args) => {
          console.log("updating...."+JSON.stringify(args))
          const updatedEmployee = await Employee.findByIdAndUpdate(args._id, {
            name: args.name,
            email: args.email,
            major: args.major,
            year: args.year,
            age: args.age,
          }, { new: true });
  
          return updatedEmployee;
        },
      },
      deleteEmployee: {
        type: EmployeeType,
        description: 'Delete a employee by ID',
        args: {
          _id: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent, { _id }) => {
          const deletedEmployee = await Employee.findByIdAndDelete(_id);
          return deletedEmployee;
        },
      },
    })
  })

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
  })

app.use(express.json())
app.use('/employees', expressGraphQL({
  schema: schema,
  graphiql: true
}));


app.listen(5000, () => console.log('Server Started'))