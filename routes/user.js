const express = require("express");
const {userById, allUsers, getUser} = require("../controllers/user");

const router = express.Router();

router.get("/users", allUsers);
router.get("/user/:userId", getUser);

//Any Route Containing :userId The Application Will First Execuite userById()
router.param("userId", userById)

module.exports = router;

