module.exports = `
input bookSessionInput {
    deanUID:Int!
    slotId:String!
}
input availableSessionInput {
    deanUID:Int!
}
input updateBookedSessionInput {
    studentUID:Int!
    currentSlotId:String!
    targetSlotId:String!
}

type availableSessionResponse {
    message:String
    availablity:[availablity]
}

type availablity {
    date:String
    slots:[slots]
}

type slots {
    _id:String
    from:String
    to:String
    fkAcademicUID:Int
    fkStudentName:String
}

type bookSessionResponse {
    message:String
    severity:String
}

type updateBookedSessionResponse {
    error:[error]
    message:String
    severity:String
}

type academicListRersponse {
    message:String
    response:[academicFields]
}

type academicFields {
    uid:Int
    name:String
    type:String
}

type Mutation {
    bookSession(input:bookSessionInput):bookSessionResponse
    updateBookedSession(input:updateBookedSessionInput):updateBookedSessionResponse
}
type Query {
    academicList:academicListRersponse
    availableSession(input:availableSessionInput):availableSessionResponse
    meetings:availableSessionResponse
}
`;
