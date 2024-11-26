const ghostVersion = require('@tryghost/version');
const request = require('@tryghost/request');

module.exports = class ExplorePingService {
    constructor({PublicConfigService}) {
        this.PublicConfigService = PublicConfigService;
    }

    payload() {
        const {url, title, description, icon, locale, twitter, facebook} = this.PublicConfigService.site;
        return {
            ghost: ghostVersion.full,
            url,
            title,
            description,
            icon,
            locale,
            twitter,
            facebook
        };
    }

    async ping() {
        if (!process.env.EXPLORE_PING_URL) {
            return;
        }

        const payload = this.payload();
        const json = JSON.stringify(payload);
        console.log('Pinging AXIS-Explore with Payload', process.env.EXPLORE_PING_URL, json);

        try {
            const response = await request(process.env.EXPLORE_PING_URL, {
                method: 'POST',
                body: json,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('AXIS-Explore Response', response.statusCode, response.statusMessage);
        } catch (err) {
            console.log('AXIS-Explore Error', err.message);
        }
    }
};
