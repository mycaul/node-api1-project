const express = require("express");
const shortid = require("shortid");

const server = express();

server.use(express.json());

let users = [
    {
    id: shortid(),
    name: "Jane Doe OMG HIII",
    bio: "Not Tarzan's Wife, another Jane" 
    }
];

server.post("/api/users", (req, res) => {
    const user = req.body;
    user.id = shortid.generate();

    if(!user.name || !user.bio){
        return res.status(400).json({errorMessage: "Please provide name and bio for the user."});
    } else if(user.name && user.bio){
        users.push(user);
        return res.status(201).json(users);
    } else{
        return res.status(500).json({errorMessage: "There was an error while saving the user to the database"});
    };
});

server.get("/api/users", (req, res) => {
    if(!users){
        return res.status(500).json({errorMessage: "The users information could not be retrieved."});
    } else {
        return res.status(200).json(users);
    };
});

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;

    let found = users.find(user => user.id === id);

    if(!found){
        return res.status(404).json({message: "The user with the specified ID does not exist."});
    } else if (found){
        return res.status(201).json(found);
    } else {
        return res.status(500).json({errorMessage: "The user information could not be retrieved."});
    };
});


server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;

    let found = users.find(user => user.id === id);

    if(!found){
        return res.status(404).json({message: "The user with the specified ID does not exist."});
    } else if(found){
        users = users.filter(user => user.id !== id);
        return res.status(201).json(users);
    } else{
        return res.status(500).json({errorMessage: "The user could not be removed"});
    };  
});

server.put("/api/users/:id", (req, res) => {
    const id = req.params.id;

    const changes =req.body;

    let found = users.find(user => user.id === id);

    if(!found){
        return res.status(404).json({message: "The user with the specified ID does not exist."});
    } else if(!changes.name || !changes.bio){
        return res.status(400).json({errorMessage: "Please provide name and bio for the user."});
    } else if(changes.name && changes.bio){
        Object.assign(found, changes);
        return res.status(200).json(users);
    } else{
        return res.status(500).json({errorMessage: "The user information could not be modified."})
    };
});

const port = 8000;
server.listen(port, () => console.log("server running..."));