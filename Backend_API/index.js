const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('./config');
const app = express();
const port = 5000;

app.use(express.json());

let tasks = [
    {id:1,title:'Task 1',description:'Description 1'},
    {id:2,title:'Task 2',description:'Description 2'},
    {id:3,title:'Task 3',description:'Description 3'},
    {id:4,title:'Task 4',description:'Description 4'},
];

const sortTasks = (tasks, sortBy) => {
    if(sortBy === 'asc'){
        tasks.sort((a, b) => a.id - b.id);
    }
    else if(sortBy === 'desc'){
        tasks.sort((a, b) => b.id - a.id);
    }
    return tasks;
}

Authorizations
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


const authentication = (req, res, next) => {

    const token = req.headers['authorization'];

    if (token == null) {
        return res.status(400).send('Unauthorized');
    }

    jwt.verify(token, config.secret, (err, user) => {
        if (err) {
            return res.status(404).send('Error occured');
        }
        req.user = user;
        next();
    });
};



app.get('/GET/tasks',(req, res) => {
    try{
        const {page, limit,sortBy,order,filterBy,filterValue} = req.query;

        let filteredTasks = tasks;
        if(filterBy && filterValue){
            filteredTasks = tasks.filter(task => task[filterBy] == filterValue);
        }
        if(sortBy && order){
            filteredTasks = sortTasks(filteredTasks, order);
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    if(tasks.length == 0){
        res.status(404).send('No tasks found');
        return;
    }
    else if(page && limit){
        const slicedTasks = filteredTasks.slice(startIndex, endIndex);
        res.status(200).send('success');
        res.json(slicedTasks);
    }
    else{
        res.status(200).send('success');
        res.json(filteredTasks);
    }
}
    catch(err){
        res.status(400).send('Bad Requests');
    }
});

app.get('/GET/tasks/:id', (req, res) => {
    try{
    const id = req.params.id;
    const task = tasks.find(task => task.id == id);
    if(!task){
        res.status(404).send('Task not found in list');
        return;
    }
    else{
        res.status(200).send('success');
        res.json(task);
    }
}
   catch(err){
    res.status(400).send('Bad Requests'+err.message);
}
});

app.post('/POST/tasks',authentication, (req, res) => {
    try{
    if(!req.body.title){
        res.status(404).send('Title is required');
        return;
    }else if(!req.body.description){
        res.status(404).send('Description is required');
        return;
    }
    const task = req.body;
    tasks.push(task);
    res.status(200).send('Task added successfully');
}
    catch(err){
        res.status(400).send('Bad Requests'+err.message);
    }
});

app.put('/PUT/tasks/:id',authentication, (req, res) => {
    try{
    const id = req.params.id;
    const task = tasks.find(task => task.id == id);
    if(!task){
        res.status(404).send('Task not found in list');
        return;
    }
    else if(!req.body.title){
        task.description = req.body.description;
        res.send('Task does not have a title');
        return;
    }
    else if(!task.description){
        task.title = req.body.title;
        res.send('Task does not have a description');
        return;
    }
    else{
        task.title = req.body.title;
        task.description = req.body.description;
        res.status(200).send('Task updated successfully');
    }
}
    catch(err){
        res.status(400).send('Bad Requests'+err.message);
    }
});

app.delete('/DELETE/tasks/:id',authentication, (req, res) => {
    try{
    const id = req.params.id;
    const task = tasks.find(task => task.id == id);
    if(!task){
        res.status(404).send('Task not found in list');
        return;
    }
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    res.status(200).send('Task deleted successfully');
}
    catch(err){
        res.status(400).send('Bad Requests'+err.message);
    }
});