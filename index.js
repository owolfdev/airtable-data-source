require("dotenv").config();
const Airtable = require("airtable");

//configue Airtable
Airtable.configure({ apiKey: process.env.AIRTABLE_API_KEY });
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
const table = base(process.env.AIRTABLE_TABLE_NAME);

//require and configure readline
const input = process.stdin;
const output = process.stdout;
const rl = require("readline").createInterface({ input, output });

const createTodo = async (todo, user) => {
  console.log(todo, user);
  try {
    newRecords = await table.create([{ fields: { todo, user } }]);
    console.log(newRecords[0].id, newRecords[0].fields);
  } catch (error) {
    console.log(error);
  }
};

const getTodos = async () => {
  try {
    const records = await table.select({}).firstPage();
    return records.map((record, index) => {
      //console.log(record.fields);
      // return { ...record.fields };
      if (!record.fields.completed) {
        record.fields.completed = false;
      }
      console.log({
        name: `todo${index}`,
        todo: record.fields.todo,
        completed: record.fields.completed,
      });
      return {
        name: `todo${index}`,
        id: record.id,
        ...record.fields,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

const updateTodo = async (todo, completed) => {
  //console.log(todo);
  const id = todo.id;
  const fields = {
    todo: todo.todo,
    user: todo.user,
    completed: completed,
  };
  try {
    await table.update([{ id, fields }]);
  } catch (error) {
    console.log(error);
  }
};

const deleteTodo = async (todo) => {
  try {
    await table.destroy([todo.id]);
    console.log("todo", todo.id, "destroyed");
  } catch (error) {
    console.log(error);
  }
};

const prompt_task = () => {
  return new Promise((resolve, reject) => {
    rl.question(
      "Do you want to create, read, edit, or delete a todo. \nPlease type one of four options: ",
      (task) => {
        resolve(task);
      }
    );
  });
};

const prompt_todo = () => {
  return new Promise((resolve, reject) => {
    rl.question("Your todo: ", (todo) => {
      resolve(todo);
    });
  });
};

const prompt_user = () => {
  return new Promise((resolve, reject) => {
    rl.question("User: ", (usr) => {
      resolve(usr);
    });
  });
};

const prompt_todoName = (task) => {
  return new Promise((resolve, reject) => {
    rl.question(
      `Please typet the name of the todo that you want to ${task}: `,
      (name) => {
        resolve(name);
      }
    );
  });
};

const prompt_completed = () => {
  return new Promise((resolve, reject) => {
    rl.question("Is the todo completed? (type 'yes' or 'no') ", (completed) => {
      if (completed === "yes" || completed === "y") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const main = async () => {
  const task = await prompt_task();
  //console.log(task);
  if (task === "create") {
    const todo = await prompt_todo();
    const user = await prompt_user();
    createTodo(todo, user);
    rl.close();
    return;
  }
  if (task === "read") {
    const todos = await getTodos();
    //console.log(todos);
    rl.close();
    return;
  }
  if (task === "edit") {
    const todos = await getTodos();
    const todoName = await prompt_todoName("edit");
    const todo = todos.find((todo) => {
      return todo.name === todoName;
    });
    const completed = await prompt_completed();
    //console.log(completed);
    updateTodo(todo, completed);
    rl.close();
    return;
  }
  if (task === "delete") {
    const todos = await getTodos();
    const todoName = await prompt_todoName("delete");
    const todo = todos.find((todo) => {
      return todo.name === todoName;
    });
    deleteTodo(todo);
    rl.close();
    return;
  }

  console.log("No task selected");
  main();
};

main();
