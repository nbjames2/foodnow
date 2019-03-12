module.exports = {
    validateUsers(req, res, next) {
        if(req.method === "POST") {
            req.checkBody("email", "must be valid").isEmail();
            req.checkBody("password", "must be at least 8 characters in length").isLength({min: 8});
            req.checkBody("passwordConfimation", "must match password provided").optional().matches(req.body.password);
        }
        const errors = req.validationErrors();
    
        if (errors) {
            req.flash("error", errors);
            return res.redirect(303, req.headers.referer)
        } else {
            return next();
        }
    },
    validateSignIn(req, res, next) {
        if(req.method === "POST") {
            req.checkBody("email", "must be valid").isEmail();
            req.checkBody("password", "must be at least 8 characters in length").isLength({min: 8});
        }
        const errors = req.validationErrors();
    
        if (errors) {
            req.flash("error", errors);
            return res.redirect(303, req.headers.referer)
        } else {
            return next();
        }  
    },
    validateItem(req, res, next) {
        if(req.method === "POST") {
            req.checkBody("item", "must be at least 2 characters in length").isLength({min: 2});
            req.checkBody("max", "must be at least 1 character in length").isLength({min: 1});
        }
        const errors = req.validationErrors();
        if(errors) {
            req.flash("error", errors);
            return res.redirect(303, req.headers.referer);
        } else {
            return next();
        }
    },
    validateList(req, res, next) {
        if(req.method === "POST") {
            req.checkBody("title", "must be at least 2 characters in length").isLength({min: 2});
        }
        const errors = req.validationErrors();
        if(errors) {
            req.flash("error", errors);
            return res.redirect(303, req.headers.referer);
        } else {
            return next();
        }
    }
}