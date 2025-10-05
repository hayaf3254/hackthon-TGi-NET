import fs from "node:fs";
import express from "express";
import cors from "cors";
import testRouter from './test/test';
import circleTestRouter from './test/circle';
import userRouter from './user/user';
import authRouter from './auth/auth';

//const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

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



