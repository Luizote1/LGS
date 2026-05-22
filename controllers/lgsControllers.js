class LgsController {
    index(req, res) {
        res.render("lgs/index", {
            layout: false
        });
    }
}

module.exports = LgsController;