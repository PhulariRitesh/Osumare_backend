const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());

let tasks = [
    {id:1,title:'Task 1',description:'Description 1'},
    {id:2,title:'Task 2',description:'Description 2'},
    {id:3,title:'Task 3',description:'Description 3'},
    {id:4,title:'Task 4',description:'Description 4'},
];
app.get('/GET/tasks', (req, res) => {
    try{
    if(tasks.length == 0){
        res.status(404).send('No tasks found');
        return;
    }
    else{
        res.status(200).send('success');
        res.json(tasks);
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

app.post('/POST/tasks', (req, res) => {
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

app.put('/PUT/tasks/:id', (req, res) => {
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

app.delete('/DELETE/tasks/:id', (req, res) => {
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