// Create web server

// Import modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// Create web server
var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    console.log('resource=' + resource);

    // Routing
    if (resource == '/create') {
        // Create comment
        create(request, response);
    } else if (resource == '/list') {
        // List comment
        list(request, response);
    } else {
        // Error
        response.writeHead(404, {'Content-Type': 'text/html'});
        response.end('404 Page Not Found');
    }
});

// Start web server
server.listen(3000, function () {
    console.log('Server running at http://localhost:3000');
});

// Function to create comment
function create(request, response) {
    if (request.method == 'POST') {
        // Read data from body
        request.on('data', function (data) {
            var body = data.toString();
            var post = qs.parse(body);
            var content = post.content;
            var comment = {
                content: content,
                created_at: Date.now()
            };
            // Save comment
            comments.push(comment);
            console.log(comments);
            // Redirect to list
            response.writeHead(302, {'Location': '/list'});
            response.end();
        });
    } else {
        // Show form
        var html = fs.readFileSync('create.html', 'utf8');
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(html);
    }
}

// Function to list comment
function list(request, response) {
    var html = fs.readFileSync('list.html', 'utf8');
    html = html.replace('#comments#', createHtmlTable(comments));
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(html);
}

// Function to create HTML table
function createHtmlTable(comments) {
    var tags = '';
    for (var i in comments) {
        var comment = comments[i];
        tags += '<tr>';
        tags += '<td>' + comment.content + '</td>';
        tags += '<td>' + comment.created_at + '</td>';
        tags += '</tr>';
    }
    return tags;
}

// Array