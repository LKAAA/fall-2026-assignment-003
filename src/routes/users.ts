import { Router, Request, Response } from 'express';
import { getAllUsers, getUserById, createUser } from '../dal/users.js';

const router = Router();

router.get('/', async function (req, res) {
    console.log('Request users:', res.locals.requestId);
    const users = await getAllUsers();
    return res.json(users);
});

router.get('/:id', async function (req, res) {
    const { id } = req.params;
    const userIdNum = +id;
    if (Number.isNaN(userIdNum)) {
        return res.status(400).json({ error: 'userIdNum must be a number' });
    }

    const user = await getUserById(userIdNum);
    if (!user) {
        return res.status(404).json({ error: 'user not found'});
    }
    return res.json(user);
});

router.post('/', async function (req, res) {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required'})
    }

    const NewUser = await createUser({ name, email });
    return res.status(201).json(newUser);
});

export default router;
