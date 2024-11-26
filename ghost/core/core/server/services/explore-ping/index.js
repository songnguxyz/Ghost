const PublicConfigService = require('../public-config');
const ExplorePingService = require('./ExplorePingService');

const explorePingService = new ExplorePingService({
    PublicConfigService
});

module.exports.init = async function () {
    await explorePingService.ping();
};
