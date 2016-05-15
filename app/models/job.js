/**
 * Created by anisbenbrahim on 17/04/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;



/* *************************************** */
/*               SUB SCHEMA                */
/* *************************************** */

var candidate = new Schema({
    Id_seq:String

})




// titre
// lieu
// type
// tags
// description => pdf


/* *************************************** */
/*              MAIN SCHEMA                */
/* *************************************** */


// set up a mongoose model and pass it using module.exports
var JobSchema   = new Schema({

    // titre de l'offre
    title:{ type:String, required:true },

    // ville où se trouve le travaille
    company:{ type: String, required:true },

    // type de l'offre
    address:{ type: String, required:true },

    // tags describing the job
    tags:{ type: [String] },


    // pdf of the job
    type: { type: Number, required:true  },

    // text inside the pdf
    description: { type: String , required:true  },

    candidate: {type: [candidate]},

    googleLocalisation : Object
});


/* *************************************** */
/*                 Indexes                 */
/* *************************************** */

//UserSchema.index({ mail: 1}); // schema level    , token: -1

//JobSchema.index({"title":"text","ville":"text","tags":"text", "textfile":"text"});



/* *************************************** */
/*                 METHODS                 */
/* *************************************** */



// Export the main schema
module.exports = mongoose.model('Job', JobSchema);