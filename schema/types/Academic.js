module.exports = `
input createAcademicInput {
    fkUniversityID:Int!
    fkCourseID:Int!
    name:String!
    email:String!
    password:String!
    confirmPassword:String!
    type:String!
}
input loginInput {
    uid:Int!
    password:String!
}

type loginResponse {
    error:[error]
    message:String
    severity:String
    token:String
}

type Mutation {
    createAcademic(input:createAcademicInput):generalFormResponse
}
type Query {
    login(input:loginInput):loginResponse
}
`;
