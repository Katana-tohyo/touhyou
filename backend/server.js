const express = require("express");
const db = require("./knex");
const cors = require("cors");
const axios = require("axios");
const handlerVoteTitle = require("./handlers/vote_title");
const handlerUserTitle = require("./handlers/user_title");

function setupServer() {
    const app = express();
    app.use(express.json());
    // app.use("/", express.static("./public"));

    //vote_title///////////////////////////////////////
    app.get('/api/votes/:id', async(req,res)=>{
        console.log("--get-votes--")
        try {
            const id = Number(req.params.id)
            const resData = await handlerVoteTitle.find(db, id)
            res.status(200).json(resData)
        }catch(e){
            console.log(e)
        res.status(404).json(e)}
    })

    app.get('/api/votes', async(req,res)=>{
        console.log("--get-votes--")
        try {
            const resData = await handlerVoteTitle.all(db)
            console.log("--get-votes--",resData)
            res.status(200).json(resData)
        }catch(e){
            console.log(e)
            res.status(404).json(e)}
    })

    app.post('/api/votes', async(req,res)=>{
        console.log("--post-votes--")
        try {
            const params = req.body
            const [resData] = await handlerVoteTitle.new(db,params)
            console.log("--post-votes--",resData)
            res.status(201).json(resData)
        }catch(e){
            console.log(e)
            res.status(404).json(e)}
    })

    //user_title///////////////////////////////////////
    app.post('/api/answer', async(req,res)=>{
        console.log("--post-answer--")
        const params = req.body
        try {
            const [resData] = await handlerUserTitle.new(db,params)
            res.status(201).json(resData)
        }catch(e){
            console.log(e)
            res.status(404).json(e)}
    })

    return app;
}

module.exports = { setupServer };