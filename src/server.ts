// require('dotenv').config();

//IMPORTS
// const express = require('express')
// const cors = require('cors')
// const app = express()

// import dotenv from 'dotenv';
// import express,  { Express, Request, Response } from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import { z } from 'zod'

require('dotenv').config();
const express = require('express')
// const mongoose = require('mongoose')
const cors = require('cors')
// const z = require('zod')


const app/* : Express  */= express();

//MIDDLEWARE
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: true }))

// connect to Database
const connectToDB = require('./db/connect')


/* const VersionSchema = z.object({
    versionFullName: z.string(),
    versionShortName: z.string(),
    booksInTheVersion: z.array(
        z.object({
            book: z.object({
                bookid: z.number(),
                name: z.string(),
                chronorder: z.number(),
                chapters: z.number(),
            }),
            chaptersContent: z.array(z.object({
                chapterNumber: z.number(),
                verses: z.array(z.object({
                    pk: z.number(),
                    verse: z.number(),
                    text: z.number(),
                })),
            })),
        })
    ),
}); */

// type Version = z.infer<typeof VersionSchema>

const versionSchema = new mongoose.Schema({
    versionFullName: String,
    versionShortName: String,
    booksInTheVersion: [
        {
            book: {
                bookid: Number,
                name: String,
                chronorder: Number,
                chapters: Number,
            },
            chaptersContent: [
                {
                    chapterNumber: Number,
                    verses: [{
                        pk: Number,
                        verse: Number,
                        text: Number,
                    }]
                }
            ]
        }
    ]
})


type Version = {
    versionFullName: string;
    versionShortName: string;
    booksInTheVersion: Array<{
      book: {
        bookid: number;
        name: string;
        chronorder: number;
        chapters: number;
      };
      chaptersContent: Array<{
        chapterNumber: number;
        verses: Array<{
          pk: number;
          verse: number;
          text: number;
        }>;
      }>;
    }>;
  };

const Version = mongoose.model("Version", versionSchema)

app.get("/", (req/* : Request */, res/* : Response */) => {
    console.log("ok")

    res.send("Hello VERSIONS")
})

app.get("/:shortName", (req/* : Request */, res/* : Response */) => {
    const { shortName } = req.params;

    Version.findOne({ versionShortName: shortName.toUpperCase() })
        .then((version: Version | null) => {
            if (version) {
                res.json(version);
            } else {
                res.status(404).json({ error: "Version not found" });
            }
        })
        .catch((err: any) => {
            console.log(err);
            res.status(500).json({ error: "Internal server error" });
        });
});

const port = process.env.PORT?.toString() || "3924";
async function start() {
    try {
        await connectToDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`http://localhost:${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()
