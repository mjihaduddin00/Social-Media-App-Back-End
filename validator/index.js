exports.createPostValidator = (req, res, next) => {

    //Title
    req.check('title', "Write a title").notEmpty()
    req.check('title', "Title must be between 4 to 150 characters").isLength({
        min: 4,
        max: 150
    });

    //Body
    req.check('body', "Write a body").notEmpty()
    req.check('body', "Body must be between 4 to 2000 characters").isLength({
        min: 4,
        max: 2000
    });

    //Check For Errors
    const errors = req.validationErrors()
    //If Error Show The First One As They Happen
    if(errors) {
        const firstError = errors.map((error) => error.msg)[0]
        return res.status(400).json({error: firstError})
    }

    //Proceed To Next Middleware
    next();
};

exports.userSignupValidator = (req, res, next) => {
    //Name Is Not Null And Between 4-10 Characters
    req.check("name", "Name is required").notEmpty();
    //Email Is Not Null, Valid And Normalized
    req.check("email", "Email muust be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
        min: 4,
        max: 2000
    });
    //Check For Password
    req.check("password", "Password is required").notEmpty();
    req.check('password')
    .isLength({min: 6})
    .withMessage("Password must contain at least 6 characters")
    .matches(/\d/)
    .withMessage("Password must contain a number");
    //Check For Errors
    const errors = req.validationErrors();
    //If Error Show The First One As They Happen
    if(errors) {
        const firstError = errors.map((error) => error.msg)[0];
        return res.status(400).json({error: firstError});
    }
    //Proceed To Next Middleware
    next();
};