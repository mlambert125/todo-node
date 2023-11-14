import express from 'express';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';

const app = express();
const port = 3000;
const client = new mongodb.MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('todo');

app.use(bodyParser.json());

app.use('/', express.static('public'));

app.get('/api/todos', async (req, res) => {
    const todos = await db.collection('todo-lists').find({}).toArray();
    res.setHeader('Content-Type', 'application/json');
    res.send(todos);
});

app.post('/api/todos', async (req, res) => {
    const todo = req.body;
    await db.collection('todo-lists').insertOne(todo);
    res.send(todo);
});

app.put('/api/todos/:id', async (req, res) => {    
    const id = parseInt(req.params.id);
    const todo = req.body;
    await db.collection('todo-lists').updateOne({ _id: id }, { $set: todo });
    res.send(todo);    
});

app.delete('/api/todos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await db.collection('todo-lists').deleteOne({ _id: id });

    console.log(result);
    res.send({ "message": "Todo list " + id + " deleted" });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
