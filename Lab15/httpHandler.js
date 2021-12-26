import url from 'url';
import fs from 'fs';
import DB from "./DB.js";

const _db = new DB();

export default class HttpHandler {

    static onGet(request, response) {
        const pathname = url.parse(request.url).pathname;
        if (pathname === '/api/faculties') {
            _db.getAll("faculty")
                .then((faculties) => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(faculties));
                })
                .catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
        } else if (pathname === '/api/pulpits') {
            _db.getAll("pulpit")
                .then((pulpits) => {
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify(pulpits));
                })
                .catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
        } else {
            HttpHandler.onError(request, response, 400, 'Ресурс не найден');
        }
    }

    static onPost(request, response) {
        const pathname = url.parse(request.url).pathname;
        if (pathname === '/api/faculties') {
            let faculty_data = '';
            request.on('data', chunk => {
                faculty_data += chunk;
            });
            request.on('end', () => {
                _db.create('faculty', JSON.parse(faculty_data))
                    .then((created_faculty) => {
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify(created_faculty));
                    })
                    .catch(error => {
                        HttpHandler.onError(request, response, 500, error);
                    });
            });
        } else if (pathname === '/api/pulpits') {
            let pulpit_data = '';
            request.on('data', chunk => {
                pulpit_data += chunk;
            });
            request.on('end', () => {
                _db.create('pulpit', JSON.parse(pulpit_data))
                    .then((created_pulpit) => {
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify(created_pulpit));
                    })
                    .catch(error => {
                        HttpHandler.onError(request, response, 500, error);
                    });
            });
        } else {
            HttpHandler.onError(request, response, 400, 'Ресурс не найден');
        }
    }

    static onPut(request, response) {
        const pathname = url.parse(request.url).pathname;

        if (pathname === '/api/faculties') {
            let faculty_data = '';
            request.on('data', chunk => {
                faculty_data += chunk;
            });
            request.on('end', () => {
                let faculty = JSON.parse(faculty_data);
                _db.update('faculty', { 'faculty': faculty.faculty }, faculty)
                    .then((updated_faculty) => {
                        if (updated_faculty) {
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.end(JSON.stringify(updated_faculty));
                        } else {
                            throw 'Факультет не найден';
                        }
                    })
                    .catch(error => {
                        HttpHandler.onError(request, response, 500, error);
                    });
            });
        } else if (pathname === '/api/pulpits') {
            let pulpit_data = '';
            request.on('data', chunk => {
                pulpit_data += chunk;
            });
            request.on('end', () => {
                let pulpit = JSON.parse(pulpit_data);
                _db.update('pulpit', { 'pulpit': pulpit.pulpit }, pulpit)
                    .then((updated_pulpit) => {
                        if (updated_pulpit) {
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.end(JSON.stringify(updated_pulpit));
                        } else {
                            throw 'Кафедра не найдена';
                        }
                    })
                    .catch(error => {
                        HttpHandler.onError(request, response, 500, error);
                    });
            });
        } else {
            HttpHandler.onError(request, response, 400, 'Ресурс не найден');
        }
    }

    static onDelete(request, response) {
        let pathname = url.parse(request.url).pathname.split('/');
        pathname.pop();
        pathname = pathname.join('/');
        const code = url.parse(request.url).pathname.split('/').pop();

        if (pathname === '/api/faculties') {
            _db.delete('faculty', { 'faculty': code })
                .then(deletedFaculty => {
                    if (deletedFaculty) {
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify(deletedFaculty));
                    } else {
                        throw 'Факультет не найден';
                    }
                })
                .catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
        } else if (pathname === '/api/pulpits') {
            _db.delete('pulpit', { 'pulpit': code })
                .then(deletedPulpit => {
                    if (deletedPulpit) {
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify(deletedPulpit));
                    } else {
                        throw 'Кафедра не найден';
                    }
                })
                .catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
        } else {
            HttpHandler.onError(request, response, 400, 'Ресурс не найден');
        }
    }

    static onError(request, response, code, message) {
        response.writeHead(code, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(`{"error": "${code}", "message": "${message}"}`);
    }
}
