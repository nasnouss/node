  
var fs      = require('fs');
var profile = require('../../node_modules/linkedin-public-profile-parser/lib/profile');

var util = require('util');
var assert = require('assert');
var s = require('node-svd');
var math = require('mathjs');

    /* *************************************** */
    /*                Tools             */ 
    /* *************************************** */



module.exports = {
  mult: function (X, Y) {
    assert(X[0].length == Y.length, 'Invalid dimension!');
  // dimensions
  var m = X.length, n = Y[0].length, d = Y.length;
  // multiplication
  var Z = new Array(X.length);
  for(var i = 0; i < X.length; ++i){
    Z[i] = new Array(Y[0].length);
    for(var j = 0; j < Y[0].length; ++j){
      Z[i][j] = X[i].map(function(x, k){
        return x * Y[k][j];
      }).reduce(function(a, b){ return a + b; }, 0);
    }
  }
  return Z;
  },
  GetVectorFromMatrice: function (matrice, numeroVector) {
    
var vector = []
for (var i=0; i< matrice.length; i++){

vector.push(matrice[i][numeroVector - 1])



}

return vector
  },
  ReduceDimentionMatrixU: function (matrice, dimmentionToKeep) {

var vector = []
for (var i=0; i< matrice.length; i++){
  var temp =[]
  for(var j =0; j< dimmentionToKeep.length;j++){
    if (dimmentionToKeep[j] == 1)
      temp.push(matrice[i][j])
  
  }


  vector.push(temp)


}
   return vector 

  },
  ReduceDimentionMatrixV: function (matrice, dimmentionToKeep) {

var vector = []

  for(var j =0; j< dimmentionToKeep.length;j++){
    if (dimmentionToKeep[j] == 1)
      vector.push(matrice[j])

}
   return vector 

  },
  ReduceDimentionMatrixS: function (matrice, dimmentionToKeep) {

var vector = []

  for(var j =dimmentionToKeep.length-1; j>=0;j--){
    console.log("========> on lit : " + matrice[j])
    console.log("========> dimention" + dimmentionToKeep[dimmentionToKeep.length-1-j])
    if (dimmentionToKeep[dimmentionToKeep.length-1-j] == 1)
      vector.push(matrice[j])

}
console.log("matrice before diagolaisses : " + matrice)
console.log("matrice that gonna be diagonaliss : " + vector)
   return math.diag(vector)

  },
  NormeVecteur: function (vecteur) {
   
   var somme = 0

   for (var i=0; i< vecteur.length; i++){

    somme = somme + math.pow(vecteur[i],2)

   }


return Math.sqrt(somme)

  },
  UfoisV: function (vecteurU, vecteurV) {

    //assert(vecteurU.length != vecteurV.length, 'Invalid dimension!');

    var sommeProduit = 0 

     for (var i=0; i< vecteurU.length; i++){
        sommeProduit = sommeProduit + vecteurU[i]*vecteurV[i]

     }

return sommeProduit

  },
  DistanceVector: function (VecteurU,VecteurV) {

 var normeVecteurU = this.NormeVecteur(VecteurU);
 var normeVecteurV = this.NormeVecteur(VecteurV);

 var produitVecteur = this.UfoisV(VecteurU,VecteurV);

 return (produitVecteur)/ (normeVecteurU*normeVecteurV)

 
  },

  Similarite: function (inputMatrice) {
    var svd = s.svd(inputMatrice, 0, { U: true, V: false, debug: 1});


console.log("la matrice S " + svd.S)

 var seuil = this.quartile(svd.S)

dimentionToKeep =  this.DimentionToKeep(svd.S,seuil)

console.log("dimensionToKeep : " + dimentionToKeep)



console.log("Mastrie S " +JSON.stringify(svd.S)) 
console.log("--------------------------------") 
console.log("Mastrie V " + JSON.stringify(svd.V))
console.log("--------------------------------")
console.log("Mastrie U " + JSON.stringify(svd.U))

console.log("--------------------------------")
console.log("--------------------------------")
console.log("--------------------------------")
console.log("Mastrie U reduced : " + JSON.stringify(this.ReduceDimentionMatrixU(svd.U, dimentionToKeep)))
console.log("--------------------------------")
console.log("Mastrie V reduced : " + JSON.stringify(this.ReduceDimentionMatrixV(svd.V, dimentionToKeep)))
console.log("--------------------------------")
console.log("Mastrie S reduced : " + JSON.stringify(this.ReduceDimentionMatrixS(svd.S, dimentionToKeep)))




var S = this.ReduceDimentionMatrixS(svd.S, dimentionToKeep);
var V = this.ReduceDimentionMatrixV(svd.V, dimentionToKeep);
var U = this.ReduceDimentionMatrixU(svd.U, dimentionToKeep);

 var B = this.mult(U, this.mult(S, V));

 console.log("resultat de la mult " + JSON.stringify(B))

  similarite = []

  var vecteur1 = this.GetVectorFromMatrice(B,1)

 for (var i=2; i<= B[0].length; i++){ // on ne prend pas le premier vecteur donc i=1 au départ
 var vecteur2 = this.GetVectorFromMatrice(B,i)

similarite.push(this.DistanceVector(vecteur1,vecteur2))
}


return similarite

  },

  quartile: function (array, percent) {
   if (!percent) percent = 50;
             array = array.sort(function(a, b){return a-b});
             var n = Math.round(array.length * percent / 100);
             

             return array[n-1];;
  },

  DimentionToKeep: function (list, seuil) {
    var dimentionToKeep = []
    

    for (var i =list.length -1 ; i>=0 ;i--){

      console.log("list : " + list[i])
       console.log(" seuil : " + seuil) 
       
       if (list[i] >= seuil){ 
        console.log("true")
        dimentionToKeep.push(1)
      } else {
        console.log("false")
        dimentionToKeep.push(0)
      }
      
      }
      console.log("c'et bisar tout caaa " + dimentionToKeep)
    return dimentionToKeep
  },

  bar: function () {
    // whatever
  }

};



