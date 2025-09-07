module.exports = function (req, res, next) {
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
        return res.status(401).json({
            msg: 'No API key, authentication denied'
        });
    }

    // Compare with the API key in .env
    if (apiKey !== process.env.APP_API_KEY) {
        return res.status(401).json({
            msg: 'Invalid API Key'
        });
    }

    next(); // If the API key is correct then move forward
};
