// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs      = require('fs');

var morgan      = require('morgan');
var mongoose    = require('mongoose');

var stormpath = require('express-stormpath');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config/config'); // get our config file

var multer  = require('multer')
var https = require('https');
var upload = multer()

var ent = require('ent');

var decode = require('ent/decode');
var tls = require('tls');

var Victor = require('victor');
var tools = require('./app/routes/tools.js'); // à supprimer 
var toolsV = require('./app/routes/toolsSVD.js'); // à supprimer 


var request = require('request');



// pour Oauth
//var clientController = require('./app/controllers/client');


// BEAN ??
var User     = require('./app/models/user');
 


var model ;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());





var options = {
   key  : fs.readFileSync('./certs/private_key.key'),
   cert : fs.readFileSync('./certs/certificate.pem')
};





var port = process.env.PORT || 3000;        // set our port


mongoose.connect(config.database); // connect to our database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));







 





// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

/*
     app.post('/test', upload.array(), function (req, res, next) {


         
         

})
*/

router.route('/test')

// create a bear (accessed at POST http://localhost:8080/api/inscription)
    .post(upload.array(), function (req, res, next) {

        // recupration du token
      var Rtoken = tools.TakeToken(req);



        // initialisation d'un objet user pour recuperer son profil
      var user = new User({token : Rtoken});

         // recuperation du profil de l'utilisateur
         user.GetUserLinkedInProfil(function (err,utilisateur) {
             if (err)
                 res.send(err);




             if(utilisateur != null){

             // on recupere les mots dans le body
             var searchword = req.body.words


             // on recupere les mots similaires sur le serveur de calculs
             request.post(
                 {url: 'http://127.0.0.1:5000/word2vec/', form: {listWord: searchword}, timeout: 10000},

                 function (error, response, body) {
                     if (!error && response.statusCode == 200) {

                         // parse body
                         var synonyme = JSON.parse(body)

                         // pour tous les mots
                         for (item in synonyme) {
                             for (word in synonyme[item]) {

                                 // probabilité du mot
                                 var proba = synonyme[item][word][1]

                                 if (proba > 0.60) {

                                     // on empile les mots, il ne faut pas les mettre dans une liste car on ne veut pas de ","
                                     searchword.concat(" " + synonyme[item][word][0])
                                 }

                             }


                         }


                         console.log("Mots à chercher dans les documents : " + searchword)
                     } else {
                         res.send("an error occured")
                     } // fin else

                     // on recupere la liste du reseau du candidat ( voir 2 à 3 niveaux)

                     // var listeFriend = ['571195a65d09a3720400000c', '571236b04554d0040600000a', '57128e73e07c9dc00600000b',
                     // '57129f6ccfdabf1b0700000b' , '5711954f5d09a3720400000b', '5712d8686c4794cc07000025']





                     var friends = new User()


                     var listeFriend = friends.getMyFriends(utilisateur)

                     // on remonte le profil des personnes qui ont les mots clés dans leur CV
                     friends.KeywordSearchUser(listeFriend, searchword, function (err, docs) {
                         if (err)
                             res.send("an error occured")


                         console.log("Nombre de documents trouvé : " + docs.length)







                         var listepreparationlsa = []

                         // on rajoute le CV de l'utilisateur

                         listepreparationlsa.push(tools.GetAnalyseTextFromLinkedInResume(utilisateur))

                         // on recupere les champs textuels que l'on va analyser
                         for (item in docs) {

                             listepreparationlsa.push(tools.GetAnalyseTextFromLinkedInResume(docs[item]))
                         }

                         console.log(listepreparationlsa)

                         // send to lsa

                         request.post(
                             {url: 'http://127.0.0.1:5000/lsa/', form: listepreparationlsa, timeout: 10000},

                             function (error, response, body) {
                                 if (!error && response.statusCode == 200) {


                                     var scores = JSON.parse(body)

                                     var finalResult = []

                                     // add the score to json
                                     for (item in scores) {
                                        if (item > 0) {
                                            // - 1 car on prend pas en compte le profil de l'utilisateur
                                            document = (docs[item-1]).toJSON()
                                            document.scorelsa = scores[item]

                                            finalResult.push(document)
                                        }

                                     }
                                     res.send(finalResult)


                                 }
                             })


                     });


                 } // fin function
             ) // fin request serveur python

         } else {// fin if utilisateur != null
                 res.send("votre profil est introuvable")

             }
 }) // fin search user


});// fin post

        // ya un fichier tools svd à enlever mtn qu'on exeternalise en python





 app.get('/test', function (req, res) {
    res.send('Hello World!');
 });





 //USER
  require('./app/routes/public/routeInscription')(router,app);




router.route('/authenticate')

.post( function(req, res) {

  // find the user
  User.findOne({
    mail: req.body.mail
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: -1 // expires in 24 hours
        });


         // initialise the user object with the token
        user.token= token;

        // store the token
        user.save(function(err) {
                if (err)
                    res.send(err);

               // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token,
          expireIn: token.expiresInMinutes
        });



            });




      }   

    }

  });
});



// ---------------  A chaque requet qu'on verifie qu'il y bien un token ---------------------//

// middleware to use for all requests
router.use(function(req, res, next) {
      // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];


    console.log("token : " + token)

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
          console.log(err)
        return res.status(403).send({ success: false, message: 'Failed to authenticate token.' });
          console.log("Failed to authenticate token.")
      } else {
        // if everything is good, save to request for use in other routes
        console.log("tout va bien")
        req.decoded = decoded;    
        next();
      }
    });

  } else {
    console.log("pas de token ")
    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});




// ************************* load the routes ********************** //

//USER
  require('./app/routes/private/routeUser')(router);
// JOBS
require('./app/routes/private/routeJobs')(router);

// Group
require('./app/routes/private/routeGroup')(router);

// pour faire le tutorial pour Oauth 


// ------------------------------------------------ Fin tutorial Oauth 








// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// ============================================================================= HTTPS
/*http.createServer(options, app).listen(3000, function () {


   console.log('Started!');

});*/

// ============================================================================= HTTP

app.listen(port);
console.log('Started!');












