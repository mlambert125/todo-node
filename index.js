import express from 'express';
import bodyParser from 'body-parser';
import mongodb from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;
const client = new mongodb.MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('todo');
const JWT_SECRET = 'THIS_IS_MY_SECRET_JWT_KEY';

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (authHeader === undefined) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];    

    if (token === null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}

app.use(bodyParser.json());

app.use('/', express.static('public'));

app.get('/api/todos', verifyToken, async (req, res) => {
    const todos = await db.collection('todo-lists').find({ author: req.user.username }).toArray();
    res.setHeader('Content-Type', 'application/json');
    res.send(todos);
});

app.post('/api/todos', verifyToken, async (req, res) => {
    const todo = req.body;
    todo.author = req.user.username;
    await db.collection('todo-lists').insertOne(todo);
    res.send(todo);
});

app.put('/api/todos/:id', verifyToken, async (req, res) => {    
    const id = parseInt(req.params.id);
    const todo = req.body;

    todo.author = req.user.username;
    await db.collection('todo-lists').updateOne({ _id: id, author: req.user.username }, { $set: todo });
    res.send(todo);    
});

app.delete('/api/todos/:id', verifyToken, async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await db.collection('todo-lists').deleteOne({ _id: id, author: req.user.username });

    console.log(result);
    res.send({ "message": "Todo list " + id + " deleted" });
});


app.post('/api/login', async (req, res) => {   
    const loginInfo = req.body;

    const user = await db.collection('users').findOne({ 
        _id: loginInfo.username
    });

    if (user === null) {
        res.status(401).send({ message: "Invalid username/password" });
    } else {
        if (await bcrypt.compare(loginInfo.password, user.password)) {
            const token = jwt.sign({ username: user._id }, JWT_SECRET);
            res.send({ message: "Login successful", token: token });
        } else {
            res.status(401).send({ message: "Invalid username/password" });
            return;
        }
    }
});

app.post('/api/register', async (req, res) => {
    const registerInfo = req.body;

    registerInfo.password = await bcrypt.hash(registerInfo.password, 10);

    try {
        await db.collection('users').insertOne(registerInfo);
        res.send({ message: "Registration successful" });
    } catch (error) {
        res.status(400).send({ message: "Registration failed (user exists)" });
    }    
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
