//L'application requiert l'utilisation du module Express.
//La variable express nous permettra d'utiliser les fonctionnalités du module Express.
var express = require('express');
// Nous définissons ici les paramètres du serveur.
var hostname = 'localhost';
var port = 3000;



// Nous créons un objet de type Express.
var app = express();



var mysql = require("mysql");


//Database connection
app.use(function(req, res, next){
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'rootroot',
		database : 'demo'
	});
	//connection.connect();
	connection.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
	  });
	next();
});


//Afin de faciliter le routage (les URL que nous souhaitons prendre en charge dans notre API), nous créons un objet Router.
//C'est à partir de cet objet myRouter, que nous allons implémenter les méthodes.
var myRouter = express.Router();


var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Je vous rappelle notre route (/personnes).
myRouter.route('/personnes')
// J'implémente les méthodes GET, PUT, UPDATE et DELETE
// GET
.get(function(req,res){
	  //res.json({
       //message : "Liste toutes les personnes ",
       //nom : req.query.nom,
       //methode : req.method
     //});

		connection.query('SELECT * from personnes', function (error, results) {
			if (error) throw error;
			res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
		});
	

})
//POST
.post(function(req,res){
    //   res.json({
    //     message : "Ajoute une nouvelle personne à la liste ",
    //     nom : req.body.nom,
    //     prenom : req.body.prenom,
    //     description : req.body.description,
    //     methode : req.method
	//   });
	
	  connection.query("INSERT INTO personnes (nom, prenom, description) VALUES ('"+ req.body.nom +"','" +req.body.prenom + "','"+req.body.description+"');", function (error, results) {
		if (error) throw error;
		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
	});
})
//PUT
.put(function(req,res){
      res.json({message : "Mise à jour des informations d'une personne dans la liste", methode : req.method});
})
//DELETE
.delete(function(req,res){
res.json({message : "Suppression d'une personne dans la liste", methode : req.method});
});

// Nous demandons à l'application d'utiliser notre routeur
app.use(myRouter);


// Démarrer le serveur
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port);
});



myRouter.route('/personnes/:personne_id')
.get(function(req,res){
	  res.json({message : "Vous souhaitez accéder aux informations de la personne n°" + req.params.personne_id});
})
.put(function(req,res){
	  res.json({message : "Vous souhaitez modifier les informations de la personne n°" + req.params.personne_id});
})
.delete(function(req,res){
	  res.json({message : "Vous souhaitez supprimer la personne n°" + req.params.personne_id});
});




myRouter.route('/')
// all permet de prendre en charge toutes les méthodes.
.all(function(req,res){
      res.json({message : "Bienvenue sur notre API ", methode : req.method});
});



