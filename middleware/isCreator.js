module.exports = (req, res, next) => {
        // checks if the user is logged in when trying to access a specific page
        const { routesCreated } = req.user
        if (routesCreated.includes(req.params.id)) {
            return next();
        } else {
            //return res.status(403).send({ msg: "You are not allowed to modify this element" });
            return res.render("errors/error403")
        }
    };
