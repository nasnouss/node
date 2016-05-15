var User = require('../../models/user');
var Resume = require('../../models/Resume');
var Group = require('../../models/group');
var fs      = require('fs');
var util = require('util');
var tools = require('../tools');
var profile = require('../../../node_modules/linkedin-public-profile-parser/lib/profile');
var multer  = require('multer')
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var express    = require('express');

var bcrypt = require('bcryptjs');

var app        = express();


var upload = multer()

var config = require('../../../config/config'); // get our config file
app.set('superSecret', config.secret); // secret variable



module.exports = function(router) {

router.route('/inscription')




    .post(upload.array(), function (req, res, next) {


        // =====> mettre une securite ici if on a tout les champs
      if (req.body.lastName!= undefined && req.body.firstName != undefined && req.body.password!= undefined && req.body.mail != undefined)  {

      var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        

        // on recupere les données de la requete pour les assigner à une instance de User
        var user = new User();      
        user.lastName = req.body.lastName;  
        user.firstName = req.body.firstName;
        user.password = hash;
        user.mail = req.body.mail;
        user.fullname = user.firstName + " " + user.lastName;

user.findUserByMail(function (err,myUser){
    if(err) throw err

        if(myUser !== null){
            res.send({message: " user already existe"});
          


        } else {

          

        var html = req.body;
        //var lastName = user.lastName;
        //var firstName = user.firstName;
        //var mail = user.mail ;
        var url = req.body.url;

        if (req.body.profil !== undefined && url !== undefined){  



 var uuid = Math.floor((1 + Math.random()) * 0x10000).toString(16) 

 var path = "./" + uuid + ".html"    


          
var log_file = fs.createWriteStream(path, {flags : 'w'});
var log_stdout = process.stdout;

  log_file.write(util.format(html) + '\n');
  log_stdout.write(util.format(html) + '\n');



// on lit le fichier html contenant le profil de l'utilisateur
fs.readFile( path, function(err, html) {

  // parsing du profil
  profile(url, html, function(err, data) {


      // on enregistre le profil parsé dans la variable user qui va être poussé en base de données
      resumer = new Resume();
      resumer.linkedProfil = data;

      resumer.save(function(err){
          console.log(err);
      })
      user.linkedProfil = resumer._id;

      //onsole.log(data)

      // =========>  Rajouter la detection de la la langue du profil

      /* ici il faut traduire les mots :
       prendre tous les champs textuelles dans une variable:
       - on enleves les accents
       - terminaison
       - garder que la root
       - (voir exemple R tp data mining, et exemple pour la génération du model des synonymes)

       traduire tous le mots mais le mot root sera comme un ID
       il y aaura donc en base de données :
       - ID : généré automatiquement
       - root : la racine du mot



       on split cette variable en tableau de mots




       */


      if (resumer.linkedProfil.education.length != 0) {

      // algo pour intergrer la personne à ses groupes respectif
      for (var i = 0; i < resumer.linkedProfil.education.length; i++) {

          var group = new Group()
          var listeanalyse = [];
          summary = "";

          this.summary = resumer.linkedProfil.education[i].nameDegree + " " + resumer.linkedProfil.education[i].schoolName
          listeanalyse.push(summary)

          if (this.summary.trim().length != 0){

          group.GetGroupByTags(resumer.linkedProfil.education[i].nameDegree + " " + resumer.linkedProfil.education[i].schoolName,function(err, groups){
             // console.log("les mots a chercher : " + i + " " +  user.linkedProfil.education[i].nameDegree + " " + user.linkedProfil.education[i].schoolName)
             // console.log("les groups sont : " + i + " " + groups)

          })
          }

      }


        }

      var token = tools.CreateToken(user, app);

        // initialise la variable "user" pour enregistrer le token en base de données
        user.token = token;

       // store the token
        user.save(function(err) {
                if (err)
                    res.send(err);

            res.json({ message: 'User created!' , token: token});

              });
   
  })
})



        } // fin if 




            //supprimer le fichier html
            fs.unlinkSync(path);


        }

    });



      } // fin if undefined

        else {
          res.send("tous les arguments doivent etre present")

      }

});




    router.route('/login')




        .post(upload.array(), function (req, res, next) {


            //  verification des champs. en fair run fucntion




            // On cree un objet pour trouver l'utilisateur via son email
            // return : mail, password, token
            var user = new User({mail: req.body.mail}, {mail: 1, password: 1, token : 1, firstName: 1, lastName:1});

            // on trouve l'utilisateur
            user.findUserByMail(function(err, utilisateur){
                if(err || !utilisateur){
                    res.send(401);

                } else {

                 console.log("le user est  " + utilisateur)


                // verification du mot de passe
               var verification =  bcrypt.compareSync(req.body.password, utilisateur.password);


                // success verification & token existe
                if(verification && utilisateur.token){
                    console.log("if : verification et token existe ")
                    res.json({firstName: utilisateur.firstName, lastName: utilisateur.lastName ,token : utilisateur.token});

                } else if(verification){
                    console.log("il y a que verification")

                    var token = tools.CreateToken(user, app);


                    utilisateur.token = token;




                    // store the token
                    utilisateur.save(function(err) {
                        if (err){
                            console.log(err)
                            res.send(500);

                    } else {
                        console.log("tout est ok")
                        res.json({

                            firstName: utilisateur.firstName,
                            lastName: utilisateur.lastName,
                            token: utilisateur.token
                        });
                    }
                    });

                } else {
                    res.send(401);
                }

                }

            }) // fin finuserbymail


        })


  


}; // fin export 