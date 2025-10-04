import fs from "node:fs";
import express from "express";
import cors from "cors";

//const express = require('express');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log("Server is runnning on http://localhost:5000");
})

console.log("Hello TypeScript on Windows!");
console.log("files:", fs.readdirSync("."));