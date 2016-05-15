// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;





/* *************************************** */
/*               SUB SCHEMA                */ 
/* *************************************** */

// Friend shema that we store in the user profil
var FriendSchema   = new Schema({
	Id_Seq:String,
	
});

// Group shema that we store in the user profil
var GroupSchema   = new Schema({
	Id_Seq:String,
	
});

var NotificationSchema   = new Schema({
    Id_Seq:String,
    type: Number
    
});

// Group shema that we store in the user profil
var DemandSchema   = new Schema({
    Id_Seq:String
    
});


var JobUploaded = new Schema({
    Id_Seq:String

})



/* *************************************** */
/*              MAIN SCHEMA                */ 
/* *************************************** */


// set up a mongoose model and pass it using module.exports
var UserSchema   = new Schema({ 

    // mail of the user
    mail:{ type:String, required:true , unique: true},

    // firstname of the user
    firstName:{ type:String, required:true },

    // lastname of the user 
    lastName:{ type:String, required:true },

    fullname: { type:String, required:true },

    // password
    password:{ type:String, required:true },

    linkedProfil: {type:String, required:true},

    // date of the creation of the user
    dateCreated: { type: Date, default: Date.now },

    // Role of the user : USER, PRENIUM .... 
    role: { type: String, default: 'USER' } ,

    // Current token of the user
    token:{ type: String, unique: true },  //, default: null

    // if the user has an account or he deleted it
    visibility: { type: Boolean, default: true },

    // List of his friends
    friends: [FriendSchema],

    // list of all groups he is member
    groups: [GroupSchema],

    //request list made by the user 
    demand: [DemandSchema],

    // list of jobs we applied
    jobUploaded: [JobUploaded],

    isFirstConnection: { type: Boolean, default: true },

    // notifaction for that user
    notification:[NotificationSchema]
});

/* *************************************** */
/*                 Indexes                 */ 
/* *************************************** */



UserSchema.index({"fullname":"text"});



// "linkedProfil.skills":"text",    linkedProfil.skills: 3,

/* *************************************** */
/*                 METHODS                 */ 
/* *************************************** */

// catch the user by his token
UserSchema.methods.findUserIdByToken = function (cb) {
  return this.model('User').findOne({ token: this.token }, cb)
}


UserSchema.methods.searchUser = function (name, cb) {
    return this.model('User').find({$text: {$search: name}}, {firstName : 1, lastName: 1 , scoreMDB: {$meta: "textScore"}}, cb).sort({scoreMDB:1}).limit(20)
}


// catch the user by his token
UserSchema.methods.GetIdLinkedInProfil = function (cb) {
    return this.model('User').findOne({ token: this.token }, {linkedProfil : 1}, cb);
}



//find User by his Id and visibility
UserSchema.methods.findUserByIdAndVisibility = function (cb) {
  return this.model('User').findOne({ _id: this._id }, cb)
}


// trouver un utilisateur par son mail et sa visibilité
UserSchema.methods.findUserByMail = function (cb) {
  return this.model('User').findOne({ mail: this.mail }, cb)
}


// ajouter l'id d'un groupe dans le profil de l'utilisateur
UserSchema.methods.addMeToTheGroupAndNotify = function (cb) {
    this.model('User').findByIdAndUpdate(this._id,  {$addToSet:{groups: this.groups} } ,cb)               // ({ groups.Id_Seq: this.mail,visibility :true  }, cb)
}


// ajouter l'id d'une offre qu'on vient d'uploader
UserSchema.methods.addAnUploadedJob = function(obj, cb){

    this.model('User').findByIdAndUpdate(this._id, {$addToSet:{jobUploaded: obj}}, cb)
}

// supprimer le groupe dans le profil de l'utilsiateur
UserSchema.methods.removeMeToTheGroup = function (id,cb) {
    this.model('User').groups.where('Id_Seq').equals(id).remove(); 
    this.save(cb);             // ({ groups.Id_Seq: this.mail,visibility :true  }, cb)
}



// prendre tout les ID des groupes d'un utilisateur 
UserSchema.methods.getMyGroups = function(user){
    var idGroup = []

      for (i=0 ; i< user.groups.length; i++){
         idGroup.push(user.groups[i].Id_Seq)
       }  

       return idGroup;
}




// prendre tous les amis d'un utilisateurs à partir d'un JSON
UserSchema.methods.getMyFriends = function(user){
    var idFriend = []

    for (i=0 ; i< user.friends.length; i++){
        idFriend.push(user.friends[i].Id_Seq)
    }

    return idFriend;
}

// en parametre : les ID des amis et des personnes appartenant aux groupe auquel l'utilisateur appartient
// retourne tour les profil de cette liste
UserSchema.methods.GetMyFriendsProfil = function(list,cb){

   return this.model('User').find({
                            '_id': { $in: list}, 
                            }, {linkedProfil : 1}, cb)
}



UserSchema.methods.GetMyOpportunities = function(list,cb){

    return this.model('User').find({
        '_id': { $in: list},
    }, {linkedProfil : 1}, cb)
}


UserSchema.methods.KeywordSearchUser = function (list, words, cb){

    if(words.trim().length == 0){
        // search normal, put scoreMDB to 0
        return this.model('User').find({'_id': { $in: list} }, {linkedProfil : 1, scoreMDB: {$meta: "textScore"}}, cb)
    } else {

  return this.model('User').find({$text: {$search: words}, '_id': { $in: list} }, {linkedProfil : 1, scoreMDB: {$meta: "textScore"}}, cb)
}

}







/*
UserSchema.methods.CountWordscope = function(list ,cb){

//console.log("--------------->liste de mos " + listOfPerson[0].linkedProfil.skills)

//var mots = listOfPerson[0].linkedProfil.skills[1]

var o = {};
o.map = function() {


var summary = ""
// add all skills
 for (var i = 0; i< this.linkedProfil.skills.length; i++){

  summary =  summary + " " + this.linkedProfil.skills[i]

}


// add past experiences
 for (var i = 0; i< this.linkedProfil.experience.past.length; i++){

  summary =  summary + " " + this.linkedProfil.experience.past[i].desc

}

// add cureent experiences
 for (var i = 0; i< this.linkedProfil.experience.current.length; i++){

  summary =  summary + " " + this.linkedProfil.experience.current[i].desc

}




    if (summary) {
        // quick lowercase to normalize per your requirements
        summary = summary.toLowerCase().split(" ");
        for (var i = summary.length - 1; i >= 0; i--) {

            // might want to remove punctuation, etc. here
            // take off bad word or ofen bad word

            if (summary[i])  {      // make sure there's something
               emit(summary[i] , 1); // store a 1 for each word
            }
        }
    }
}





o.reduce = function( key, values ) {
    var count = 0;

    values.forEach(function(v) {

        count += v;
    });
    return  count ;
}

o.query = { _id: {$in : list}}



this.model('User').mapReduce(o,cb);

} // fin fonction
*/




UserSchema.methods.LsaGetDocument = function(list ,cb){

//console.log("--------------->liste de mos " + listOfPerson[0].linkedProfil.skills)

//var mots = listOfPerson[0].linkedProfil.skills[1]

var o = {};
o.map = function() {  


var summary = ""
// add all skills
 for (var i = 0; i< this.linkedProfil.skills.length; i++){

  summary =  summary + " " + this.linkedProfil.skills[i]

}


// add past experiences
 for (var i = 0; i< this.linkedProfil.experience.past.length; i++){

  summary =  summary + " " + this.linkedProfil.experience.past[i].desc

}

// add cureent experiences
 for (var i = 0; i< this.linkedProfil.experience.current.length; i++){

  summary =  summary + " " + this.linkedProfil.experience.current[i].desc

}


            // might want to remove punctuation, etc. here
            // take off bad word or ofen bad word

            if (summary)  {     // make sure there's something
               emit(this._id , summary); // store a 1 for each word
            }
        
    
}






o.query = { _id: {$in : list}} 



this.model('User').mapReduce(o,cb);

} // fin fonction



UserSchema.methods.deletethisuser = function(cb){

    return this.model('User').remove( { token: this.token }, cb)
}



// Export the main schema
module.exports = mongoose.model('User', UserSchema);


