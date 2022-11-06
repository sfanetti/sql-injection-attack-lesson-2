const http = require('http'),
path = require('path'),
express = require('express'),
bodyparser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.static('.'));
app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json());

const db = new sqlite3.Database(':memory:');
db.serialize(function() {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});

app.get('/', function (req,res) {
    res.sendFile('index.html');
})

app.post('/login', function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const query = "SELECT title FROM user WHERE username = '" + username + "' and password = 'unknown' OR '1' = '1'";

    console.log({ username, password, query });

    db.get(query, function(err, row) {
        if(err) {
            console.log("Error", err);
            res.redirect("/index.html#error");
        } else if (!row) {
            res.redirect("index.html#unauthorized");
        } else {
            res.send(`Hello <b>${username}</b>
                      <br/>
                      <p>
                        This file contains all your secret codez. 
                        <br/>
                        <br/>
                        Your account info: $0 
                        <br/>
                        <br/>
                        Your password list: ...
                      </p>`)
        }
    });
});

app.listen(3000);
console.log("Listening on port 3000")


