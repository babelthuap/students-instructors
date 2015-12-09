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

let LEVELS_ENUM = ["FRESHMAN", "SOPHMORE", "JUNIOR", "SENIOR"];

let courses = [
  {id: 101, name: "Skydiving", instructor: 13, students: new Set([7])},
  {id: 102, name: "ReactCamp", instructor: 42, students: new Set([7, 9])}
];

let grades = [
  {id: Math.random(), student: 7, course: 101, grade: 0},
  {id: Math.random(), student: 7, course: 102, grade: 2},
  {id: Math.random(), student: 9, course: 102, grade: 4}
];

let GRADES_ENUM = ["F", "D", "C", "B", "A"];

//***************************//
// Methods to Query Database //
//***************************//

Array.prototype.findOneByPropValue = function(prop, value) {
  for (let i = 0; i < this.length; ++i) {
    if (this[i][prop] == value) return this[i];
  }
  return null;
}

Array.prototype.findAllByPropValue = function(prop, value) {
  let results = [];
  for (let i = 0; i < this.length; ++i) {
    if (this[i][prop] == value) {
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
      resolve: ({firstName, lastName}) => `Professor ${firstName} ${lastName}`
    },
    age: { type: GraphQLInt },
    gender: { type: GraphQLString },
    courses: {
      type: new GraphQLList(courseType),
      resolve: ({id}) => courses.findAllByPropValue('instructor', id)
    }
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
    },
    courses: {
      type: new GraphQLList(courseType),
      resolve: ({id}) => courses.filter(course => course.students.has(id))
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
    },
    students: {
      type: new GraphQLList(studentType),
      resolve: obj => {
        let studentList = [...obj.students];
        return studentList.map(studentId => students.findOneByPropValue('id', studentId));
      }
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

function filterCollection(collection, filter, filterBy, defaultFilter) {
  if (filter) {
    if (!filterBy) filterBy = defaultFilter;
    if (!isNaN(Number(filter))) filter = Number(filter); // convert number input
    return collection.findAllByPropValue(filterBy, filter);
  } else {
    return collection;
  }
}

let schema = new GraphQLSchema({
  // top level fields
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      
      instructors: {
        type: new GraphQLList(instructorType),
        args: {
          filter: { type: GraphQLString },
          filterBy: { type: GraphQLString }
        },
        resolve: (_, {filter, filterBy}) => filterCollection(instructors, filter, filterBy, 'firstName')
      },

      students: {
        type: new GraphQLList(studentType),
        args: {
          filter: { type: GraphQLString },
          filterBy: { type: GraphQLString }
        },
        resolve: (_, {filter, filterBy}) => filterCollection(students, filter, filterBy, 'firstName')
      },

      courses: {
        type: new GraphQLList(courseType),
        args: {
          filter: { type: GraphQLString },
          filterBy: { type: GraphQLString }
        },
        resolve: (_, {filter, filterBy}) => filterCollection(courses, filter, filterBy, 'name')
      },

      grades: {
        type: new GraphQLList(gradeType),
        resolve: () => grades
      }

    })
  })
});

export default schema;
