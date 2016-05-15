var Job = require('../../models/job');
var User = require('../../models/user');

var multer  = require('multer')
var upload = multer()
var tools = require('./../tools');

// expose the routes to our app with module.exports
module.exports = function(router) {




  /* *************************************** */
  /*                CREATE GROUP             */
  /* *************************************** */

  // $$$$$$$$$$$$$$$
  /*

   Mettre un findByID


   */
  // $$$$$$$$$$$$$$$

  router.route('/job')
      // create a Group (accessed at POST http://localhost:8080/api/Groups)
      .post(upload.array(), function(req, res, next) {



          var title = req.body.title;
          var company = req.body.company;
          var address = req.body.address;
          var type =  req.body.type;
          var description = req.body.description;
          var tags = req.body.tags;




          var geocoderProvider = 'google';
          var httpAdapter = 'https';

          // optional
          var extra = {
              apiKey: 'AIzaSyCcR7rxu3zi6gsGtXlp1D3DTrwrNx23H9Q', // for Mapquest, OpenCage, Google Premier
              formatter: null         // 'gpx', 'string', ...
          };

          var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);



          var GoogleAPI;
// Or using Promise
          geocoder.geocode(address)
              .then(function(response) {
                  GoogleAPI = response[0];






                  var job = new Job({title : title, company: company, address: address, type: type, description: description , tags: tags, googleLocalisation: GoogleAPI})

                  console.log(job)

                  job.save(function(err, jobsaved){
                      if(err || !jobsaved){
                          res.sendStatus(500)

                      } else {

                          console.log("job saved " + jobsaved)

                          var Rtoken = tools.TakeToken(req);
                          // initialisation de l'objet user

                          var user = new User({token: Rtoken});

                          // recuperation du profil de l'utilisateur
                          user.findUserIdByToken(function (err, User) {
                              if (err || !User) {
                                  res.sendStatus(500);
                              } else {


                                  var objToAdd = {Id_Seq: jobsaved._id};

                                  console.log("User.jobUploaded : " + User)
                                  User.addAnUploadedJob(objToAdd,function (err) {
                                      if (err){
                                          res.send("Impossible d'ajouter l'offre a votre profil")
                                      } else {
                                          res.sendStatus(200)
                                      }

                                  })
                              }


                          })

                      } // fin if
                  })




              })
              .catch(function(err) {
                  console.log(err);
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


      });


  /* *************************************** */
  /*                  UPDATES                */
  /* *************************************** */

  // $$$$$$$$$$$$$$$
  /**/
  // $$$$$$$$$$$$$$$



  /*
   * Id_Seq : user that we want to add
   *
   */


  router.route('/groups/addmember/:group_id')

      // update the Group with this id (accessed at PUT http://localhost:8080/api/Groups/:Group_id)
      .put(function(req, res) {



      });




  router.route('/groups/:group_id')


      /* *************************************** */
      /*                  DELETES                */
      /* *************************************** */




      .delete(function(req, res) {


      });



  router.route('/groups/user')


      .delete(function(req, res) {


      });





};
