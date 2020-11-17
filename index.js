const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

const db = require('./config/mongoose');
const Todo = require('./models/todo');

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded());

app.use(express.static('assets'));

app.get('/', function(req, res) {
    Todo.find({}, function(err, todos) {
        if (err) {
            console.log('error in fetching contacts', err);
            return;
        }
        return res.render('home', {
            Todo_list: todos
        });
    });
});

// for creating a task
app.post('/create', function(req, res) {
    Todo.create({
        description: req.body.description,
        category: req.body.category,
        date: req.body.date
    }, function(err, newTodo) {
        if (err) {
            console.log("error in creating a todo", err);
            return
        }
        console.log(newTodo);
        return res.redirect('back');
    });
});

// for deleting a task
app.post('/delete', function(req, res) {
    console.log('in delete controller!');
    let id = req.body;
    var count = Object.keys(id).length;
    console.log(count);
    for (let i = 0; i < count; i++) {
        //Deleting the task from the database by using their individual ids
        Todo.findByIdAndDelete(Object.keys(id)[i], function(err) {
            if (err) {
                console.log("Error in deleting the task from DB", err);
            }
        });
        console.log("Task-Deleted");
    }
    return res.redirect('back');
});

app.listen(port, function(err) {
    if (err) {
        console.log(`Error: ${err}`);
    }
    console.log(`Server is running on the port: ${port}`)
});