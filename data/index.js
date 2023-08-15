const utils = require("../utils/utils");

module.exports = {
  universities: [
    {
      name: "Delhi University",
      establishedYear: 1987,
      address: "Delhi",
    },
    {
      name: "Guru Gobind Singh Indraprastha University",
      establishedYear: 1990,
      address: "Delhi",
    },
  ],
  courses: [
    {
      university: "Delhi University",
      name: "B.Tech",
      duration: "4 Years",
    },
    {
      university: "Delhi University",
      name: "MCA",
      duration: "3 Years",
    },
    {
      university: "Delhi University",
      name: "B.Sc.",
      duration: "3 Years",
    },
  ],
  users: [
    {
      university: "Delhi University",
      course: "B.Tech",
      name: utils.fakePerson(),
      email: "abc@mail.com",
      password: "Welcome1!",
      confirmPassword: "Welcome1!",
      type: "STUDENT",
    },
    {
      university: "Delhi University",
      course: "B.Tech",
      name: utils.fakePerson(),
      email: "abcd@mail.com",
      password: "Welcome1!",
      confirmPassword: "Welcome1!",
      type: "STUDENT",
    },
    {
      university: "Delhi University",
      course: "B.Tech",
      name: utils.fakePerson(),
      email: "abcde@mail.com",
      password: "Welcome1!",
      confirmPassword: "Welcome1!",
      type: "DEAN",
    },
  ],
};
