const express = require('express');
const { users } = require('./database');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 3000;
const tokenSecret = process.env.SECRET || 'token123secretASD';

const app = express();

app.use(bodyParser.json())

app.listen(port, () => console.log('Server Started'));

const validateRequest = (requiredRole) => {
    return (req, res, next) => {
        const { authorization } = req.headers
        const token = authorization.substring('Bearer '.length);
        try {
            const { exp, iss, role } = jwt.verify(token, tokenSecret);

            if (iss === 'my-api' && exp < Date.now() && role === requiredRole) {
                next();
                return;
            }
        } catch (err) {
            res.sendStatus(403);
            return;
        }
    }
}


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username);

    if (!user || user.password !== password) {
        res.status(400);
        res.send({ message: 'Invalid username or password' })
        return;
    }

    if (user.password === password) {
        const token = jwt.sign({
            role: user.role,
        }, tokenSecret, {
            algorithm: 'HS256',
            expiresIn: '5m',
            issuer: 'my-api',
            subject: user.id
        })
        res.send({ token });
        return;
    }
});

app.get('/users', validateRequest('admin'), (req, res) => {
    res.send(JSON.stringify({ users }))
});

app.get('/users/:userId', validateRequest('admin'), (req, res) => {
    const { params } = req;
    const { userId } = params;

    const user = users.find((user) => user.id === userId);

    if (!user) {
        res.sendStatus(404)
        return;
    }
    res.send({ user })
});