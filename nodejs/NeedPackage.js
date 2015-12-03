module.exports = {
  // Create a NeedPackage
  create: function __create(uuid) {
    return {
      jsonClass: "RentalOfferNeed",
      need: 'car_rental_offer',
      uuid: uuid
    };
  }
};
