const { check, body,validationResult } = require('express-validator');

exports.validateGMB = [
    body('gmbUrl')
        .notEmpty().withMessage('GMB URL is required')
        // .isURL() checks if the input is a valid URL (e.g., uses http/https, proper domain structure)
        .isURL().withMessage('Invalid URL format')
        // .matches is a validator that checks if the input string matches the given regular expression pattern.
        // The pattern /google\./ checks if the string contains 'google.' (the word 'google' followed by a literal dot).
        // This is used to ensure the input contains a Google domain within the URL.
        .matches(/(google\.com\/maps|maps\.app\.goo\.gl)/).withMessage('URL must be a Google Maps link'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Pass errors as 'errors' (array), and explicitly set 'error' flag for EJS template compatibility
            return res.status(422).render('Home', { error: true, errors: errors.array() });
        }
        next();
    }
]