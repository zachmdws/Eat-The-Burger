const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");

const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080;


app.use(express.static("public"));


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Rootroot1",
  database: "burgers_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});



app.get('/', function(req, res) { 
    connection.query('SELECT * FROM burgers;', function(err, data) { 
   
        if (err) {
            return res.status(500).end();
        }

        res.render('index', { burgers: data.filter(burger => !burger.devoured), devburgers: data.filter(burger => burger.devoured) });
    
    });
});

// Create a new burger

app.post('/', function(req, res){ 
    connection.query('INSERT INTO burgers (burger_name) VALUES (?)', [req.body.burger_name], function(err, data) { 
        if (err) { 
           
            return res.status(500).end();
        }

        res.redirect('/');

    });
});

app.get('/api/burgers', function(req, res) { 
    connection.query('SELECT * FROM burgers;', function(err, data) { 
        if (err) { 
            return res.status(500).end();
        }

        res.json(data);
    });
});


// Update a burger to devoured
app.put('/api/burgers/:id', function(req, res){ 
    connection.query('UPDATE burgers SET devoured = true WHERE id = ?', [req.params.id], function(err, result) { 
        if (err) { 
            return res.status(500).end();
        }
        else if ( result.changedRows === 0 ) { 
            return res.status(404).end();
        }
        
        res.status(200).end();
       
    });
});











app.listen(PORT, function() { 
    console.log('Server listening on: http://localhost:' + PORT);
})