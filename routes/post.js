const express = require("express");
const {getPosts, createPost} = require("../controllers/post");
const {requireSignin} = require("../controllers/auth");
const {userById} = require("../controllers/user");
const {createPostValidator} = require('../validator')

const router = express.Router();

router.get("/", getPosts);
router.post("/post", requireSignin, createPostValidator, createPost);

//Any Route Containing :userId The Application Will First Execuite userById()
router.param("userId", userById)

module.exports = router;

