module.exports = `
input createUpdateCourseInput {
    id:Int
    fkUniversityID:Int!
    name:String!
    duration:String!
}

type findCourseByIDResponse {
    response:courseFields
}

type coursesResponse {
    response:[courseFields]
}

type courseFields {
    id:Int
    fkUniversityID:Int
    university:String
    name:String
    duration:String
}

type Mutation {
    createCourse(input:createUpdateCourseInput):generalFormResponse
    updateCourse(input:createUpdateCourseInput):generalFormResponse
}
type Query {
    courses:coursesResponse
    findCourseByID(input:idInput):findCourseByIDResponse
}
`;
