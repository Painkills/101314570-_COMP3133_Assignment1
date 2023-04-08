const User = require('./models/userModel');
const Employee = require('./models/employeeModel');
const { GraphQLError } = require('graphql');


exports.resolvers = {
    Query: {
        getEmployees: async (parent, args) => {
            const employees = await Employee.find()
            if(employees.length < 1) throw new Error("Rawr!")
            return employees
        },
        getEmployeeByID: async (parent, args) => {
            const emp = await Employee.findById({_id: args.id})
            if (!emp) throw new Error("Employee not found.")
            return emp
        },
        login: async (parent, args) => {
            console.log("logging in " + args.username)
            let user = await User.findOne({username: args.username})
            if (!user) throw new Error ("Cannot verify credentials. Check username and password.")
            const isMatch = await new Promise((resolve, reject) => {
                user.verifyPassword(args.password, (err, isMatch) => {
                    if (err) reject(err);
                    resolve(isMatch);
                });
            });
            console.log(isMatch)
            if (!isMatch) throw new Error("Cannot verify credentials. Check username and password.")
            return user;
        }
    },

    Mutation: {
        addEmployee: async (parent, args) => {
            console.log("adding " + args)
            let newEmp = new Employee(args)
            let empResult = await newEmp.save()
            if (!empResult) throw new Error("Employee was not created.")
            return empResult
        },
        register: async (parent, args) => {
            console.log("registering" + args.id)
            let newUser = new User(args)
            let userResult = await newUser.save()
            if (!userResult) throw new Error("User was not created.")
            return userResult
        },
        updateEmployee: async (parent, args) => {
            console.log("updating" + args.id)
            const employee = await Employee.findByIdAndUpdate(args.id, args, { new: true });
            if (!employee) {
                throw new Error("Employee update failed");
            }
            return employee;
        },
        deleteEmployee: async (parent, args) => {
            console.log("deleting" + args.id)
            const result = await Employee.findByIdAndDelete(args.id);
            console.log(result)
            if (!result) {
                throw new Error("User deletion failed");
            }
            return "User deleted successfully."
        }
    }
}