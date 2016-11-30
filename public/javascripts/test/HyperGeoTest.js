/*
Radhika Mattoo, November 2015 N.Y.

Porting Sungear from Java to Javascript,
Test JS function, adapted from Ilyas' Java code

*/
var HypergeometricDistribution = require('../hyperGeo/distribution/HypergeometricDistribution');
module.exports = {
   test: function(){
       /**
        * Calculates the upper-Cumulative-Probability of this term.
        * @param A the Total number of genes in the Genome, as given by the "Total" Attribute
        * @param Q_t number of represented genes ( Number of genes in Query associated with Term )
        * @param Q total number of genes (Total Number of genes in Query )
        * @param Term, the term object whose stored count is being updated in Term.js
        * @return the Probability-Value
        */
        // var A = Term.getTotal();
        // var A_t = Term.p_t * A;
        //
        // Term.H = new HypergeometricDistribution(A, A_t, Q);
        // return Term.H.upperCumulativeProbability(Q_t);
   }

};
