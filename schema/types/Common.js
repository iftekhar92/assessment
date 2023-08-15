module.exports = `
input idInput{
    id:Int!
}
type error {
    key:String
    value:String
}
type generalFormResponse {
    error:[error]
    message:String
    severity:String
}
type generalResponse {
    hasError:Boolean 
    message:String
    severity:String
}
`;
