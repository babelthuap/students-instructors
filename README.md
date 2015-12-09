# GraphQL: Students and Instructors

_by Nicholas Neumann-Chun_

This is really all about GraphQL, and hence the schema defined in `data/schema.js`.  You can see it deployed at https://fierce-refuge-5579.herokuapp.com/ or you can run it locally:

- `git clone` it
- do `npm run setup`
- then `babel-node --presets es2015 app.js`
- finally, go to `http://localhost:3000`

This will allow you to use GraphQL to query a simple dataset consisting of students, instructors, courses, and grades.  For example, try

```
{
  students(filter: "Nicholas") {
    fullName
    level
    GPA
    grades {
      course {
        name
        instructor {
          fullName
        }
      }
      grade
    }
  }
}
```
