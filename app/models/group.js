

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


/* *************************************** */
/*               SUB SCHEMA                */ 
/* *************************************** */

// Memeber shema that we store in the group
var MemberSchema   = new Schema({
	Id_Seq:String,
	date_added: { type: Date, default: Date.now },
	isAdmin: { type: Boolean, default: false }
	
});

// Admin shema that we store in the group
var AdminSchema   = new Schema({
	Id_Seq:String
	
});

// Revoked user shema that we store in the group
var RevokedMemeberSchema   = new Schema({
	Id_Seq:String
	
});

// Admin shema that we store in the group
var NameGroupSchema   = new Schema({
	
	organisation:{ type:String, required:true },
	department:{ type:String, required:true }

	
});


/* *************************************** */
/*              MAIN SCHEMA                */ 
/* *************************************** */


var GroupSchema   = new Schema({
	// name of the group
    nameGroup: [NameGroupSchema], 

    // the ID of the user who created the groupe
    userCreateGroupeId: { type:String, required:true }, 

    // date of the creation of the group
    dateCreated: { type: Date, default: Date.now },

    // if the group is still avaible for everyone
    visibility: { type: Boolean, default: true },

    // list of admins
    admins:[AdminSchema], 

    // list of member
    member: [MemberSchema],

    // description du groupe

    description : { type: [String] },

    // tag qui decrit le groupe
    tags : { type: [String] },

    // list of revoked members
    revoked:[RevokedMemeberSchema]
});


/* *************************************** */
/*                 Indexes                 */
/* *************************************** */

//UserSchema.index({ mail: 1}); // schema level    , token: -1

GroupSchema.index({"tags":"text"});


/* *************************************** */
/*                 METHODS                 */ 
/* *************************************** */


GroupSchema.methods.findGroupById = function (cb) {
  return this.model('Group').findOne({ _id: this._id}, cb)
}



GroupSchema.methods.AddDescriptionByUserProfil = function(group, user){

    console.log(" le nom du diplommmmeeee est " + user.linkedProfil.education[1].nameDegree )


}


GroupSchema.methods.GetNamesByListIds = function(list, cb){


console.log(list)

  


 return this.model('Group').find({
                            '_id': { $in: list}
                            }, cb)

// var listGroupName =[]


//     for (i=0; i< list.length; i++){

//     this.model('Group').findById(list[i], function (err, groupFound) {
//         if(err){
//             console.log("le groupe n'existe plus")
//         } else {

//         console.log("---------------- " + i)
//         console.log(listGroupName)

//         // push into a list with the name and department
//         // idGourp : list[i]  
//         listGroupName.push({organisation :  groupFound.nameGroup[0].organisation  , department :   groupFound.nameGroup[0].department})
//         // if(i == list.length){
       
//         //console.log(listGroupName)
//     //}
//         // if(i == list.length - 1){
//         // console.log(listGroupName)
//         // return listGroupName;
//    // }

// }

//     });

       

//     }

//       return listGroupName;
// console.log("yo" + listGroupName)  
     //return "listGroupName";

   // return listGroupName;
}


GroupSchema.methods.removeuser = function(id,cb){

// il faut mettre quelque chose dans {}
    this.model('Group').update(
        {},
        { $pull: { results: { score: 8 , item: "B" } } },
        { multi: true }
    )

}


GroupSchema.methods.GetGroupByTags = function(list,cb){

    this.model('Group').find({$text: {$search: list} }, {tags : 1, scoreMDB: {$meta: "textScore"}}, cb)
}

// Export the main schema
module.exports = mongoose.model('Group', GroupSchema);
