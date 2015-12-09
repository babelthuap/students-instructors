import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLFloat,
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
  {id: Math.random(), student: 7, course: 101, grade: 0},
  {id: Math.random(), student: 7, course: 102, grade: 2},
  {id: Math.random(), student: 9, course: 101, grade: 3},
  {id: Math.random(), student: 9, course: 102, grade: 4}
];

let GRADES_ENUM = ["F", "D", "C", "B", "A"];

Array.prototype.findOneByPropValue = function(prop, value) {
  for (let i = 0; i < this.length; ++i) {
    if (this[i][prop] === value) return this[i];
  }
  console.error('Failed to find', prop + ': ' + value, 'in', this); // DEBUG
  return null;
}

Array.prototype.findAllByPropValue = function(prop, value) {
  let results = [];
  for (let i = 0; i < this.length; ++i) {
    if (this[i][prop] === value) {
      results.push(this[i]);
    }
  }
  return results;
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
    fullName: {
      type: GraphQLString,
      resolve: ({firstName, lastName}) => `${firstName} ${lastName}`
    },
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
    fullName: {
      type: GraphQLString,
      resolve: ({firstName, lastName}) => `${firstName} ${lastName}`
    },
    age: { type: GraphQLInt },
    gender: { type: GraphQLString },
    level: {
      type: GraphQLString,
      resolve: ({level}) => LEVELS_ENUM[level - 1]
    },
    grades: {
      type: new GraphQLList(gradeType),
      resolve: ({id}) => grades.findAllByPropValue('student', id)
    },
    GPA: {
      type: GraphQLFloat,
      resolve: ({id}) => {
        let nums = grades.findAllByPropValue('student', id).map(course => course.grade);
        let GPA = nums.reduce((total, x) => total + x, 0) / nums.length;
        return Number( GPA.toFixed(2) );
      }
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
      resolve: ({instructor}) => instructors.findOneByPropValue('id', instructor)
    }
  })
});

let gradeType = new GraphQLObjectType({
  name: 'Grade',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    student: {
      type: new GraphQLNonNull(studentType),
      resolve: ({student}) => students.findOneByPropValue('id', student)
    },
    course: {
      type: new GraphQLNonNull(courseType),
      resolve: ({course}) => courses.findOneByPropValue('id', course)
    },
    grade: {
      type: GraphQLString,
      resolve: ({grade}) => GRADES_ENUM[grade]
    }
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
        type: new GraphQLList(instructorType),
        resolve: () => instructors
      },

      instructor: {
        type: instructorType,
        resolve: () => instructors[0]
      },

      allStudents: {
        type: new GraphQLList(studentType),
        resolve: () => students
      },

      allCourses: {
        type: new GraphQLList(courseType),
        resolve: () => courses
      },

      allGrades: {
        type: new GraphQLList(gradeType),
        resolve: () => grades
      }


    })
  })

});

export default schema;
