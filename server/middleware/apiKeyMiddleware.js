module.export = function (req, res, next) {
    const apiKey = req.header('x-api-key');

    if(!apiKey){
        return res.status(401).json({
            msg: 'No API key, authentication denied'
        });
    }

    // comparing with the API key whic is in .env
    if (apiKey !== process.env.APP_API_KEY){
        return res.status(401).json({
            msg: 'Invalid API Key'
        });
    }

    next(); //if the api key is correct then move forward
}