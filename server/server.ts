const fs = require("node:fs");
const express = require("express");
const cors = require("cors");
const testRouter = require('./test/test');
const circleTestRouter = require('./test/circle');
const userRouter = require('./user/user');
const authRouter = require('./auth/auth');

//const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/test', testRouter);

app.listen(PORT, () => {
    console.log("Server is runnning on http://localhost:3001");
})

console.log("Hello TypeScript on Windows!");
console.log("files:", fs.readdirSync("."));

app.use('/test', testRouter);
app.use('/api', circleTestRouter);
app.use('/api/user', userRouter);
app.use('/auth', authRouter);



