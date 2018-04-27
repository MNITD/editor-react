const aglio = require('aglio');


const blueprint = `
# GET /v1/users 
+ Response 200 (text/plain)

Hello World!
`;

const options = {
    themeVariables: 'default'
};

// aglio.render(blueprint, options, function (err, html, warnings) {
//     if (err) return console.log(err);
//     if (warnings) console.log(warnings);
//
//     console.log(html);
// });


aglio.renderFile('user.apib', 'output.html', options, function (err, warnings) {
    if (err) return console.log(err);
    if (warnings) console.log(warnings);
});