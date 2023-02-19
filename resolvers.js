const User = require('./models/userModel');
const Employee = require('./models/employeeModel');
const { GraphQLError } = require('graphql');


exports.resolvers = {
    Query: {
        getEmployees: async (parent, args) => {
            try {
                return Employee.find({})
            } catch (err) {
                return err
            }  
        },
        getEmployeeByID: async (parent, args) => {
            try {
                return Employee.findById({_id: args.id})
            } catch (err) {
                return err
            }
        },
        login: async (parent, args) => {
            try {
                let user = User.findById({_id: args.id})
                user.verifyPassword(user.id, (err, isMatch) => {
                    if (err) throw err
                    if (!isMatch) throw new GraphQLError('Cannot verify credentials.')
                })
                return user;
            } catch (err) {
                return err
            }
        }
    },

    Mutation: {
        addEmployee: async (parent, args) => {
            let newEmp;
            let result;
            try {
                newEmp = new Employee({
                    firstname: args.firstname,
                    lastname: args.lastname,
                    email: args.email,
                    gender: args.gender,    
                    salary: args.salary
                })
                return newEmp.save()
            } catch (err) {
                return err
            }
        },
        register: async (parent, args) => {
            let newUser;
            let result;
            try {
                newUser = new User({
                    username: args.firstname,
                    email: args.email,
                    password: args.password
                })
                return newUser.save()
            } catch (err) {
                return err
            }
        },
        updateEmployee: async (parent, args) => {
            try {
                if (!args.id){
                    throw new GraphQLError('No ID provided.');
                }
                return await Employee.findOneAndUpdate({_id: args.id},
                    {
                        $set: {
                            firstname: args.firstname,
                            lastname: args.lastname,
                            email: args.email,
                            gender: args.gender,
                            salary: args.salary
                        }
                    }, {new: true}, (err, employee) => {
                        if (err) 
                        {
                            throw new GraphQLError('Update Unsuccessful.')
                        } else 
                        {
                            return employee
                        }
                    });
            } catch (err) {
                return err
            }
      },
      deleteEmployee: async (parent, args) => {
        try {
            return await Employee.findByIdAndDelete(args.id)
        }catch (err) {
            return err;
        }
      }
    }
}