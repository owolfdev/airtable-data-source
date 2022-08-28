require("dotenv").config();

const Airtable = require("airtable");

//configue Airtable
Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME);

const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createTodo = async (todo, user) => {
  console.log(todo, user);
  try {
    newRecords = await table.create([{ fields: { todo, user } }]);
    console.log(newRecords[0].id, newRecords[0].fields);
  } catch (error) {
    console.log(error);
  }
};

console.log("enter a task and a user name: ");

const question1 = () => {
  return new Promise((resolve, reject) => {
    rl.question("Your todo: ", (todo) => {
      resolve(todo);
    });
  });
};

const question2 = () => {
  return new Promise((resolve, reject) => {
    rl.question("User: ", (usr) => {
      resolve(usr);
    });
  });
};

const main = async () => {
  const todo = await question1();
  const user = await question2();
  rl.close();
  createTodo(todo, user);
};

main();
