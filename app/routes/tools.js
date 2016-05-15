  
var fs      = require('fs');
var profile = require('../../node_modules/linkedin-public-profile-parser/lib/profile');

var util = require('util');
var assert = require('assert');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

    /* *************************************** */
    /*                Tools             */ 
    /* *************************************** */



module.exports = {
  TakeToken: function (req) {
    return req.body.token || req.query.token || req.headers['x-access-token'];
  },





  isElementInTable: function (tableau,element) {
    
    for(var i= 0; i < tableau.length; i++) {
            console.log("taille tableau  "+ tableau[i].Id_Seq )
            console.log( "id que l'on comapre" + element._id);
                        
            if (tableau[i].Id_Seq == element._id){
                return true;
                break;

              
            }

            return false;

    }


  },
  createProfilFile: function (d) {
// on cree un ID
var uuid = Math.floor((1 + Math.random()) * 0x10000).toString(16)

var path = "./" + __dirname + '/' +  uuid + ".html"

var log_file = fs.createWriteStream(path, {flags : 'w'});
var log_stdout = process.stdout;

log_file.write(util.format(d) + '\n');
log_stdout.write(util.format(d) + '\n');

// chemin pour enregistrer le ficgier
// var path = "./tmp/" + uuid + ".html" ;
// //var path = "./tmp/193a8.html";


// fs.writeFile(path, html, function(err) {
//     if(err) {
//         return console.log(err);
//     }


console.log("premier etape")






 
//}); 
return path;
   
  },
  parseHTML: function (text1) {

    //var textS = text1.prototype.toString
//     var start = text1.indexOf("<!DOCTYPE html>");
//     var end = text1.indexOf("</html>") + "</html>".length;

//     console.log("start : " + start  + "   end : " + end)

// return text1.substring(start, end); 


  },
  AddGroupDescriptionByUserProfil: function (group, user) {



    
    // whatever
  }

  ,
  GetAnalyseTextFromLinkedInResume: function (doc) {

    var text; 



    for (var i = 0; i< doc.linkedProfil.skills.length; i++){

  text =  text + " " + doc.linkedProfil.skills[i]

}


// add past experiences
 for (var i = 0; i< doc.linkedProfil.experience.past.length; i++){

  text =  text + " " + doc.linkedProfil.experience.past[i].desc

}

// add cureent experiences
 for (var i = 0; i< doc.linkedProfil.experience.current.length; i++){

  text =  text + " " + doc.linkedProfil.experience.current[i].desc

}

return text

  },
  CreateToken: function (user, app) {

      var toCreateToken = user._id+user.mail+user.firstName+user.lastName

      // on cree un token pour connecter automatiquement l'utilisateu apres son inscription
      var token = jwt.sign(toCreateToken, app.get('superSecret'), {
          expiresInMinutes: -1 // expires in 24 hours
      });

      return token
  },
    bar: function () {
        // whatever
    }

};



