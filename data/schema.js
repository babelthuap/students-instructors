import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

//***************************//
// Seed The Pretend Database //
//***************************//

let instructors = [
  {id: 13, firstName: "Cade", lastName: "Nichols", age: 2, gender: "male"},
  {id: 42, firstName: "Samer", lastName: "Buna", age: 7, gender: "male"}
];

let students = [
  {id: 7, firstName: "Nicholas", lastName: "Neumann-Chun", age: 126, gender: "male", level: 1},
  {id: 9, firstName: "Sarah", lastName: "Lyon", age: 125, gender: "female", level: 3}
];

let LEVELS_ENUM = ["freshman", "sophomore", "junior", "senior"];

let courses = [
  {id: 101, name: "Skydiving", instructor: 13},
  {id: 102, name: "ReactCamp", instructor: 42}
];

let grades = [
  {id: Math.random(), student: 7, course: 101, grade: "F"},
  {id: Math.random(), student: 7, course: 102, grade: "C"},
  {id: Math.random(), student: 9, course: 101, grade: "B"},
  {id: Math.random(), student: 9, course: 102, grade: "A"}
];

Array.prototype.findById = function(id) {
  for (let i = 0; i < this.length; ++i) {
    if (this[i].id === id) return this[i];
  }
  return null;
}

//**********************//
// New Type Definitions //
//**********************//

let instructorType = new GraphQLObjectType({
  name: 'Instructor',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
    gender: { type: GraphQLString }
  })
});

let studentType = new GraphQLObjectType({
  name: 'Student',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    age: { type: GraphQLInt },
    gender: { type: GraphQLString },
    level: {
      type: GraphQLString,
      resolve: ({level}) => LEVELS_ENUM[level - 1]
    }
  })
});

let courseType = new GraphQLObjectType({
  name: 'Course',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLString },
    instructor: {
      type: new GraphQLNonNull(instructorType),
      resolve: ({instructor}) => instructors.findById(instructor)
    }
  })
});

let gradeType = new GraphQLObjectType({
  name: 'Grade',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    student: {
      type: new GraphQLNonNull(studentType),
      resolve: ({student}) => students.findById(student)
    },
    course: {
      type: new GraphQLNonNull(courseType),
      resolve: ({course}) => courses.findById(course)
    },
    grade: { type: GraphQLString }
  })
});

//***************************//
// GraphQL Schema Definition //
//***************************//

let schema = new GraphQLSchema({
  // top level fields
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      
      allInstructors: {
        type: new GraphQLList( instructorType ),
        resolve: () => instructors
      },

      allStudents: {
        type: new GraphQLList( studentType ),
        resolve: () => students
      },

      allCourses: {
        type: new GraphQLList( courseType ),
        resolve: () => courses
      },

      allGrades: {
        type: new GraphQLList( gradeType ),
        resolve: () => grades
      }


    })
  })

});

export default schema;
