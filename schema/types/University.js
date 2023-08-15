module.exports = `
input createUpdateUniversityInput {
    id:Int
    name:String!
    establishedYear:Int!
    address:String
}

type findUniversityByIDResponse {
    response:universityFields
}

type universityResponse {
    response:[universityFields]
}

type universityFields {
    id:Int
    name:String
    code:String
    establishedYear:Int
    address:String
}

type Mutation {
    createUniversity(input:createUpdateUniversityInput):generalFormResponse
    updateUniversity(input:createUpdateUniversityInput):generalFormResponse
}
type Query {
    universities:universityResponse
    findUniversityByID(input:idInput):findUniversityByIDResponse
}
`;
