var mongoose = require('mongoose');
var Schema = mongoose.Schema;



/* *************************************** */
/*               SUB SCHEMA                */
/* *************************************** */

var candidate = new Schema({
    Id_seq:String

})







/* *************************************** */
/*              MAIN SCHEMA                */
/* *************************************** */


// set up a mongoose model and pass it using module.exports
var ResumeSchema   = new Schema({

    // cv
    linkedProfil:{ type:Object, required:true }

});


/* *************************************** */
/*                 Indexes                 */
/* *************************************** */

ResumeSchema.index({"linkedProfil.skills":"text","linkedProfil.experience.past.title":"text","linkedProfil.experience.past.desc":"text"});




/* *************************************** */
/*                 METHODS                 */
/* *************************************** */


ResumeSchema.methods.GetLinkedInProfil = function (cb) {
    return this.model('Resume').findOne({ _id: this._id }, {linkedProfil : 1}, cb);
}

// Export the main schema
module.exports = mongoose.model('Resume', ResumeSchema);