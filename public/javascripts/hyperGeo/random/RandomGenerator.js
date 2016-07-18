/*
Radhika Mattoo, February 2016 NY, NY

Porting Sungear from Java to Javascript,
Translated from Ilyas Mounaime's Java code

*/

//Interface
  function RandomGenerator(){}
  RandomGenerator.prototype.setSeed = function () {};
  RandomGenerator.prototype.nextBytes = function () {};
  RandomGenerator.prototype.nextInt = function () {};
  RandomGenerator.prototype.nextLong = function () {};
  RandomGenerator.prototype.nextBoolean = function () {};
  RandomGenerator.prototype.nextFloat = function () {};
  RandomGenerator.prototype.nextDouble = function () {};
  RandomGenerator.prototype.nextGaussian = function () {};

  module.exports = RandomGenerator;