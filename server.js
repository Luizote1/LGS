const express = require("express");

const lgsRoute = require("./routes/lgsRoute");

const server = express();

server.set("view engine", "ejs");
server.set("views", "./views");

server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/", lgsRoute);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("Servidor funcionando!");
});