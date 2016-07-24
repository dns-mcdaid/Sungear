/*
Radhika Mattoo, February 2016 N.Y.

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code


/** The kinds of solutions that a {@link BracketedUnivariateSolver
 * (bracketed univariate real) root-finding algorithm} may accept as solutions.
 * This basically controls whether or not under-approximations and
 * over-approximations are allowed.
 */
var AllowedSolution = {

	/** There are no additional side restriction on the solutions for
    * root-finding. That is, both under-approximations and over-approximations
    * are allowed. So, if a function f(x) has a root at x = x0, then the
    * root-finding result s may be smaller than x0, equal to x0, or greater
    * than x0.
	*/
    ANY_SIDE: "ANY_SIDE",


	/** Only solutions that are less than or equal to the actual root are
    * acceptable as solutions for root-finding. In other words,
    * over-approximations are not allowed. So, if a function f(x) has a root
    * at x = x0, then the root-finding result s must satisfy s &lt;= x0.
    */
    LEFT_SIDE: "LEFT_SIDE",

    /** Only solutions that are greater than or equal to the actual root are
     * acceptable as solutions for root-finding. In other words,
     * under-approximations are not allowed. So, if a function f(x) has a root
     * at x = x0, then the root-finding result s must satisfy s &gt;= x0.
     */
    RIGHT_SIDE: "RIGHT_SIDE",

    /** Only solutions for which values are less than or equal to zero are
     * acceptable as solutions for root-finding. So, if a function f(x) has
     * a root at x = x0, then the root-finding result s must satisfy f(s) &lt;= 0.
     */
    BELOW_SIDE: "BELOW_SIDE",


    /** Only solutions for which values are greater than or equal to zero are
     * acceptable as solutions for root-finding. So, if a function f(x) has
     * a root at x = x0, then the root-finding result s must satisfy f(s) &gt;= 0.
     */
    ABOVE_SIDE: "ABOVE_SIDE"

};
module.exports = AllowedSolution;
