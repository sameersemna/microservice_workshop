module.exports = {
  // Create a NeedPackage
  create: function __create(needUuid, type, solution) {
    return {
      jsonClass: 'RentalOfferSolution',
      needUuid: needUuid,
      solution: solution,
      type: type
    };
  },
};
