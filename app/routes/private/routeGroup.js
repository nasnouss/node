    // app/routes.js

    // load the todo model

    var Group = require('./../../models/group');

    var User     = require('./../../models/user');

    var tools = require('./../tools');



    /* *************************************** */
    /*                TOOLS                    */ 
    /* *************************************** */
    

    // expose the routes to our app with module.exports
    module.exports = function(router) {

    /* *************************************** */
    /*            GET ALL GROUPES         */ 
     //             A SUPPRIMER
    /* *************************************** */

    router.route('/groups')

    // get all the Groups (accessed at GET http://localhost:8080/api/Groups)
        .get(function(req, res) {
            Group.find(function(err, Groups) {
                if (err)
                    res.send(err);

                res.json(Groups);
            });
        });



    /* *************************************** */
    /*                CREATE GROUP             */ 
    /* *************************************** */

    // $$$$$$$$$$$$$$$
    /*

    Mettre un findByID


    */
    // $$$$$$$$$$$$$$$

    router.route('/groups')
        // create a Group (accessed at POST http://localhost:8080/api/Groups)
        .post(function(req, res) {




            // Find the user who is going to create the group 
       // take the token      
      var tokenReq = req.body.token || req.query.token || req.headers['x-access-token'];

        // find the user thanks to the token 
      User.findOne({
      token: tokenReq
      }, function(err, user) {
            if (err)
                res.send("profil introuvable")


        // liste des tags qui decrivent le groupe
        var listetag = req.body.organisation + " " + req.body.department;



      
           var Groupe1 = new Group(
                                    {
                                        nameGroup : [{ 
                                            
                                            organisation: req.body.organisation,
                                            department : req.body.department
                                        

                                        }],
                                        userCreateGroupeId :user._id ,
                                        description: req.body.description,
                                        tags: listetag.split(' '),
                                        member: [ // list of members
                                                    {
                                                        Id_Seq : user._id,  // initialise with the first user who created the group
                                                        isAdmin : true
                                                    }
                                                ],
                                        admins: [ // list of members
                                                    {
                                                        Id_Seq : user._id  // initialise with the first user who created the group
                                                    }
                                                ]
                                    }
                                );  
           console.log(Groupe1);
          
            

            // save the Group and check for errors
             Groupe1.save(function(err) {
               if (err)
                    res.send(err);



                user.groups.push({Id_Seq: Groupe1._id})

                user.save(function(err){
                    if(err)
                        res.send("il y a eu une erreu lors de l'acces de votre profil")

                });

                res.json({ message: " Group created" });
            });
      });

           


            
        });




    /* *************************************** */
    /*                GET GROUP              */ 
    /* *************************************** */

    // $$$$$$$$$$$$$$$
    /*
    Vérifier que celui qui demande les info d'un groupe qui soit membre 

    // faire une selection sur les champs renvoyer


    */
    // $$$$$$$$$$$$$$$


    router.route('/groups/:group_id')

        // get the Group with that id (accessed at GET http://localhost:8080/api/Groups/:Group_id)
        .get(function(req, res) {

            // verifier que celui qui fait la requete soit dans le groupe

            //console.log("je suis dedans raiii " + eq.params.Group_id);
            Group.findById(req.params.group_id, function(err, Group) {
                if (err)
                    res.send(err);
                res.json(Group);
            });
        });





    /* *************************************** */
    /*                GET MY GROUP             */ 
    /* *************************************** */

    // $$$$$$$$$$$$$$$
    /*
     */
    // $$$$$$$$$$$$$$$


    router.route('/mygroups')

        // get the Groups of the user with his token  (accessed at GET http://localhost:8080/api/groups/mygroups)
        .get(function(req, res) {
console.log("ozejdeojczepikfniknzrfvnzrjekafnzefrjnk")
         

                // token
              var Rtoken = tools.TakeToken(req);
              //console.log("le token est  " + Rtoken)
              // initialise la recherche
              var user =  new User({ token: Rtoken });
               // find the user who made the request
              user.findUserIdByToken(function (err, myUser) {
                   if(err || myUser == null)
                    res.json({message:"you are not in the dat base"});


                    // for (i=0 ; i< myUser.groups.length; i++){
                    //    console.log(myUser.groups[i].Id_Seq)
                    // }  

                   var idGroups =  myUser.getMyGroups(myUser) 

                   var thatgroup = new Group();

                 thatgroup.GetNamesByListIds(idGroups,function(err, docs){

                                  var listGroupName =[]

                                        for (i= 0; i < docs.length; i++) {
                                            listGroupName.push({organisation :  docs[i].nameGroup[0].organisation , department :   docs[i].nameGroup[0].department})
                                        }

                                        console.log(listGroupName)
                                         res.send(listGroupName)
     
});







           
            
        });

     console.log("je suis dedans raiii " )

});


    /* *************************************** */
    /*                  UPDATES                */ 
    /* *************************************** */

    // $$$$$$$$$$$$$$$
    /*


    verifer que pour ajouter un membre dans le groupe que la personne elle même soit membre du groupe 

    pour les autres champs il faut vérifeir que la personne soit ADMIN

    pour le champs admin voir si le user ui envoi la requete est admin

    */
    // $$$$$$$$$$$$$$$


    // ---------> Add e member to a group
    /*
    * Id_Seq : user that we want to add
    *
    */


    router.route('/groups/addmember/:group_id')

        // update the Group with this id (accessed at PUT http://localhost:8080/api/Groups/:Group_id)
        .put(function(req, res) {

    // on prend le groupe
            Group.findById(req.params.group_id, function(err, Group) {

                if (err)
                    res.send("Cannot find the group");


                // token
              var Rtoken = tools.TakeToken(req);
              console.log("le token est  " + Rtoken)
              // initialise la recherche
              var user =  new User({ token: Rtoken });
              // find the user who made the request
              user.findUserIdByToken(function (err, myUser) {
                   if(err || myUser == null){
                    res.json({message:"you are not in the dat base"});


                        } else {
                        // voir si le requeteur est dans la liste des membres
                        // dans la liste des membres il y a aussi les admins
                        console.log("le user est" + myUser)
                      var drap = tools.isElementInTable(Group.member,myUser);

                        if(drap){ // si l'ajouteur est dans le groupe

                               
                               

                                var RuserID = req.body.Id_Seq;
                                var userAdd =  new User({ _id: RuserID });
                                
                            // on verifie que l'id renseigné est bon 
                               
                            userAdd.findUserByIdAndVisibility(function (err1, userToAdd){
                              
                                if(err1 || userToAdd == null){
                                    // le user qu'on veut ajouter n'est pas dans la base de données
                                    res.json({ message: 'The user that u want to add is not in the database' });
                                
                                } else {


                                // si la personne que veut ajouter est deja membre
                                if (tools.isElementInTable(Group.member,userToAdd))
                                   res.json({ message: 'the person is already added ' });

                                // sinon on initialise notre champs a modifier
                                Group.member.push({ Id_Seq : userToAdd._id });  // update the Groups 


                                // push here more description from the user profil

                                Group.AddDescriptionByUserProfil(Group, userToAdd)


                                // on enregistre le changement
                                 Group.save(function(err) {
                                        if (err)
                                            res.send("cannot save the user");


                                        var userUpdate = new User({_id: userToAdd._id, groups:[{type:1,Id_Seq:Group._id}] });
                                        userUpdate.addMeToTheGroupAndNotify(function(err){

                                            console.log("i made ittttt");
                                        });

                                        res.json({ message: 'Group updated!' });
                                    });

                             } // fin if err || null

                            }); // findUserByIdAndVisibility

                        } else {
                            res.json({ message: 'You are nor allawded to do this negga !!' });
                        }

                            }// fin if err
                    
                        });





    });

        });





    router.route('/groups/revokemember/:group_id')

        // update the Group with this id (accessed at PUT http://localhost:8080/api/Groups/:Group_id)
        .put(function(req, res) {

    // on prend le groupe
            Group.findById(req.params.group_id, function(err, Group) {

                if (err)
                    res.send("Cannot find the group");

    // on prend l'id pour le user avec le token

    // on verifie que le user qui fait le requete est admin 

    // on verifie que le user à revoker n'est pas admin

    // on add le user dans revoke 

    // on le suprime de member


    });

        });

/*
* Add an admin in a group 
* params : group_id
* token : in the request
*
**/

        router.route('/groups/addadminmember/:group_id')

        // update the Group with this id (accessed at PUT http://localhost:8080/api/Groups/:Group_id)
        .put(function(req, res) {

    // on prend le groupe
            Group.findById(req.params.group_id, function(err, Group) {

                if (err)
                    res.send("Cannot find the group");

            // token
              var Rtoken = tools.TakeToken(req);

              // initialise la recherche
              var user =  new User({ token: Rtoken });
              // find the user who made the request
              user.findUserIdByToken(function (err, myUser) {
                   if(err || myUser== null){
                    res.json({message:"you are not in the data base"});

                } else {

                    // is the person who made the request is admin
                      var drap = tools.isElementInTable(Group.admins,myUser);
                      console.log("isAdmin ? " + drap);

                        if(drap){

                                var RuserID = req.body.Id_Seq;
                                var userAdd =  new User({ _id: RuserID });
                                console.log("cecz " + RuserID);
                               // var userToAdd = new User();

                                // find the user that we want to add as an admin
                               userAdd.findUserByIdAndVisibility(function (err,userToAdd){
                               
                                // error or no user found 
                                if(err || userToAdd == null){
                                    res.send({ message: 'The user that u want to add is not in the database' });
                                
                                } else { // the user is found

                                

                                // check if the user to add is already in the admin list
                                if (tools.isElementInTable(Group.admins,userToAdd))
                                    res.json({ message: 'the person is already an admin ' });

                                // chack if the user to add is already in the member list
                                if (tools.isElementInTable(Group.member,userToAdd))
                                    res.json({ message: 'the person is not a member of the group. please add him' });

                                Group.admins.push({ Id_Seq : userToAdd._id });  // update the Groups 

                                console.log("User to load " + Group);

                                // Save changes in the admin list
                                 Group.save(function(err) {
                                        if (err)
                                            res.send("cannot save the user in admin list");

                                        res.json({ message: 'Group updated!' });
                                    });


                                } // fin IF err || null

                            });


                            } else { // if heis not an admin
                                    res.json({ message: 'You are nor allawded to do this negga !!' });

                            } // fin if drap 

                        }// fin du if err

                        });



    });

        });



               router.route('/groups/namegroup/:group_id')

        // update the Group with this id (accessed at PUT http://localhost:8080/api/Groups/:Group_id)
        .put(function(req, res) {

    // on prend le groupe
            Group.findById(req.params.group_id, function(err, Group) {

                if (err)
                    res.send("Cannot find the group");
    // on prend le user avec le token 

    // on verifie qu'il est admin 

    // si oui on change le nom du groupe

    // on fait une vérification sur les champs organisation et department



    // on save le deux champs plus fullName


    });

        });







    router.route('/groups/:group_id')


    /* *************************************** */
    /*                  DELETES                */ 
    /* *************************************** */



    // $$$$$$$$$$$$$$$
    /*

    Verifier que l'utilsiateur qui fait le requete est admin 

    mettre la visibilty a false


    */
    // $$$$$$$$$$$$$$$

    // delete the Group with this id (accessed at DELETE http://localhost:8080/api/Groups/:Group_id)
        .delete(function(req, res) {
            Group.remove({
                _id: req.params.Group_id
            }, function(err, Group) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted' });
            });
        });



router.route('/groups/user')


.delete(function(req, res) {

    var Rtoken = tools.TakeToken(req);

        var user = new User({token : Rtoken});
        user.findUserIdByToken(function (err,user){

            user.visibilty = false;

            user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });

        });
            User.remove({
                token: Rtoken
            }, function(err, Group) {
                if (err)
                    res.send(err);

                res.json({ message: 'User Successfully deleted' });
            });
        });



      // create delete API for the friend and all other liste variables

    };
