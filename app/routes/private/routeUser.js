// app/routes.js

// load the todo model

var User = require('../../models/user');
var Group = require('../../models/group');
var Resume = require('../../models/Resume');
var tools = require('../tools');
// pour le linked IN parser
var profile = require('../../../node_modules/linkedin-public-profile-parser/lib/profile');
var fs      = require('fs');

// expose the routes to our app with module.exports
module.exports = function(router) {




/* *************************************** */
/*                GET PROFIL               */ 
/* *************************************** */

    /*       *****************************************************               */
    /*    lorsque qu'un utilisateur veut afficher le profil d'un ami    */
    /*       *****************************************************               */


router.route('/Users/friend/:User_id')

    // get the User with that id (accessed at GET http://localhost:8080/api/Users/:User_id)
    .get(function(req, res) {



        // charger le profil du demandeur 

        // verifier que le :User_id est dans la liste d'amis du demandeur
            // si non envoyer erreur
        //prend le profil est l'envoyer à l'utilisateur

        

        


    });



    /*       *****************************************************               */
    /*    lorsque qu'un utilisateur fait une recherche pour trouver une personne    */
    /*       *****************************************************               */


    router.route('/user/search/people')

        .post(function(req, res) {
           
            var name = req.body.search;

            console.log("name" + name)
            var Rtoken = tools.TakeToken(req);
            // initialisation de l'objet user

            var user = new User({token : Rtoken});

            // recuperation du profil de l'utilisateur
            user.findUserIdByToken(function (err,User) {
                if (err || !User){
                    res.send(err);

                } else {

                    user.searchUser(name, function(err, data){
                        console.log("name " + name)
                        console.log("data : "+ data)
                        res.send(data)
                    })

                }

            })



        });




    /*       *****************************************************               */
    /*    lorsque qu'un utilisateur veut afficher son profil   */
    /*       *****************************************************               */


    router.route('/user/myprofil/')
        .get(function(req, res) {

            console.log("call /user/myprofil/")
            var Rtoken = tools.TakeToken(req);
            // initialisation de l'objet user

            var user = new User({token: Rtoken});

            // recuperation du profil de l'utilisateur
            user.GetIdLinkedInProfil(function (err, User) {
                if (err) {
                    res.send(err);

                } else {

                    console.log("ID =========>" + User.linkedProfil);

                    var cv = new Resume({_id : User.linkedProfil});

                    cv.GetLinkedInProfil(function(err, vitae){

                        res.status(200).send(vitae)

                    })





                }


            });


        });
    /*       *****************************************************               */
    /*    lorsque l'utilisateur veux afficher le profil d'une recherche d'ami    */
    /*       *****************************************************               */

//
    router.route('/Users/search/:User_id')

    // get the User with that id (accessed at GET http://localhost:8080/api/Users/:User_id)
    .get(function(req, res) {

        // recuperation du token dans la requete



            // charger le profil avec :User_id

        // envoyer le profil minimum!!!!! au demandeur
        

        


    });



    /*          ***************************************               */
    /*                Trouver les amis de l'utilsiateur               */
    /*          ***************************************               */


    router.route('/Users/myfriends')

    // get the User with that id (accessed at GET http://localhost:8080/api/Users/:User_id)
    .get(function(req, res) {

    // recuperation du token dans la requete
    var Rtoken = tools.TakeToken(req);
       // initialisation de l'objet user

       var user = new User({token : Rtoken});

        // recuperation du profil de l'utilisateur
        user.findUserIdByToken(function (err,User){
                 if (err)
                res.send(err);


            listIdFriend = user.getMyFriends(User)


            var profilFriend =  user.GetMyFriendsProfil(listIdFriend, function(err, profils){
                if (err)
                    res.send(err)

                res.send(profils)


            })

            



        });

        


    });


    router.route('/Users/search/keywords')

    // get the User with that id (accessed at GET http://localhost:8080/api/Users/:User_id)
    .post(function(req, res) {

        // prendre les mot clé dans le body
        var words = req.body.words
        
        // chercher dans les experience de ses amis ces mots clés et dans les personnes faisant apparition dans les groupes ou il se trouve
            // compter les frequences d'apparition
            // ordonner selon cet indicateur

        // renvoyer la liste
        


    });

        router.route('/Users/search/company')

    // get the User with that id (accessed at GET http://localhost:8080/api/Users/:User_id)
    .post(function(req, res) {

        // prendre les mot clé dans le body

        // chercher les profils qui ont travailler dans l'entreprise
         
  

        
        


    });


    router.route('/Users/search/country')

        // get the User with that id (accessed at GET http://localhost:8080/api/Users/:User_id)
        .post(function(req, res) {

            // prendre les mot clé dans le body

            // chercher les profil qui ont travailler dans le pays et les synonymes







        });


/* *************************************** */
/*                  UPDATES                */ 
/* *************************************** */

router.route('/users')

    // update the User with this id (accessed at PUT http://localhost:8080/api/Users/:user_id)
    .put(function(req, res) {


    var Rtoken = tools.TakeToken(req);

       var user = new User({token : Rtoken});
        user.findUserIdByToken(function (err,User){

            if (err)
                res.send(err);


            // if the firstName field is not empty
            if (req.body.firstName !== undefined){
                User.firstName = req.body.firstName
            }

            // if the mail field is not empty
             if (req.body.mail !== undefined){
                User.mail = req.body.mail
            }

            // if the friend field is not empty
            if (req.body.Id_Seq !== undefined){
                User.friend.push({ Id_Seq : req.body.Id_Seq });  
            }

            // save the Group
            User.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });

        });
    });





// demande d'ajout d'ami
router.route('/users/askfriend/:User_id')

    // update the User with this id (accessed at PUT http://localhost:8080/api/Users/:user_id)
    .put(function(req, res) {

        // recuperation du token dans la requete
    var Rtoken = tools.TakeToken(req);

    // recuperation du profil du demandeur
       var user = new User({token : Rtoken});
        user.findUserIdByToken(function (err,User){

            if (err)
                res.send(err);


 

            // save the Group
            User.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'User updated!' });
            });

        });
    });


/* *************************************** */
/*                  DELETES                */ 
/* *************************************** */



    /*          ***************************************               */
    /*                Supprimer le profil de l'utilsiateur             */
    /*          ***************************************               */

router.route('/users')


    .delete(function(req, res) {

    // recuperation du token dans la requete
    var Rtoken = tools.TakeToken(req);
        // initalisation de l'objet user

       var user = new User({token : Rtoken});
        
       user.deletethisuser(function(err){

           if(err)
               res.send("on erro occured")

           res.send("user deleted")
       })
        

    });




    router.route('/users/groups')



    .delete(function(req, res) {

    // recupere le token de l'utilisateur dans la requete
    var Rtoken = tools.TakeToken(req);

        // initialisation de l'objet user
       var user = new User({token : Rtoken});

        // on remonte le profile de l'utilsiateur
        user.findUserIdByToken(function (err,User){
            if (err)
                res.send(err);


            // initialisation de l'objet groupe
            var group = new Group({_id: req.body.Id_Seq});

            // on remonte le groupe
            group.findGroupById(function(err,myGroup){
                if(err)
                    res.send("impossible de trouver le groupe")

                // on supprime le groupe dans le profil de l'utilisateur
                User.removeMeToTheGroup(myGroup._id,function(err){
                if (err) 
                    res.send("c'est la mer noire");
                
               //res.send("c'est bn");
                     myGroup.removeuser(User._id,function(err){
                         if (err)
                             res.send("une erreur s'est produite lors de la suppression de votre profile")
                         res.send("la suppression s'est bien passé")

                     })

            });

            });



        });
    });

};// fin export all fonction
