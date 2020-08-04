const express = require('express');
const shortid = require('shortid');
const server = express();

server.use(express.json());

let users = [
  {
    id: shortid.generate(),
    name: 'Michael Scott',
    bio: 'web 32 student',
  },
  {
    id: shortid.generate(),
    name: 'Luis Hernandez',
    bio: 'Node instructor',
  },
  {
    id: shortid.generate(),
    name: 'Mark P',
    bio: 'web 32 student',
  }
];

server.post('/api/users', (req, res) => {
  const newUser = req.body;
  if (!newUser.name || !newUser.bio) {
    res.status(400).json({
      errorMessage: 'Please provide name and bio for the user.',
    });
  } else {
    newUser.id = shortid.generate();
    const original = users.length;
    const updated = users.push(newUser);
    if (updated === original + 1) {
      res.status(201).json(newUser);
    } else {
      res.status(500).json({
        errorMessage:
          'There was an error while saving the user to the database',
      });
    }
  }
});

server.get('/api/users', (req, res) => {
  if (!users) {
    res.status(500).json({
      errorMessage: 'The users information could not be retrieved.',
    });
  } else {
    res.status(200).json(users);
  }
});

server.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  if (!users) {
    res.status(500).json({
      errorMessage: 'The user information could not be retrieved.',
    });
  } else {
    const found = users.find((u) => u.id === id);
    if (found) {
      res.status(200).json(found);
    } else {
      res.status(404).json({
        message: 'The user with the specified ID does not exist.',
      });
    }
  }
});

server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  if (!users) {
    res.status(500).json({
      errorMessage: 'The user could not be removed',
    });
  } else {
    const deleted = users.find((u) => u.id === id);
    if (deleted) {
      res.status(200).json(deleted);
    } else {
      res.status(404).json({
        message: 'The user with the specified ID does not exist.',
      });
    }
  }
});

server.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  if (!users) {
    res.status(500).json({
      errorMessage: 'The user information could not be modified.',
    });
  } else {
    if (changes.name === undefined || changes.bio === undefined) {
      res.status(400).json({
        errorMessage: 'Please provide name and bio for the user.',
      });
    } else {
      let found = users.find((u) => u.id === id);
      if (found) {
        Object.assign(found, changes);
        res.status(200).json(users);
      } else {
        res.status(404).json({
          message: 'The user with the specified ID does not exist.',
        });
      }
    }
  }
});

const PORT = 8888;
server.listen(PORT, () =>
  console.log(`server running on port ${PORT}`),
);