import url from 'url';
import fs from 'fs';
import DB from "./DB.js";

const _db = new DB();

export default class HttpHandler {

    static onGet(request, response) {
        const pathname = url.parse(request.url).pathname;
        if (pathname === '/') {
            fs.readFile('./index.html', (error, data) => {
                if (error) {
                    HttpHandler.onError(request, response, 500, 'Ошибка чтения файла');
                } else {
                    response.writeHead(200, {'Content-type': 'text/html; charset=utf-8'});
                    response.end(data);
                }
            });
        } else if (pathname === '/api/faculties') {
            _db.getAllFaculties().then(records => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(records.recordset));
            }).catch(error => {
                HttpHandler.onError(request, response, 500, error);
            });
        } else if (pathname === '/api/pulpits') {
            _db.getAllPulpits().then(records => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(records.recordset));
            }).catch(error => {
                HttpHandler.onError(request, response, 500, error);
            });
        } else if (pathname === '/api/subjects') {
            _db.getAllSubjects().then(records => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(records.recordset));
            }).catch(error => {
                HttpHandler.onError(request, response, 500, error);
            });
        } else if (pathname === '/api/auditoriumstypes') {
            _db.getAllAuditoriumsTypes().then(records => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(records.recordset));
            }).catch(error => {
                HttpHandler.onError(request, response, 500, error);
            });
        } else if (pathname === '/api/auditoriums') {
            _db.getAllAuditoriums().then(records => {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.end(JSON.stringify(records.recordset));
            }).catch(error => {
                HttpHandler.onError(request, response, 500, error);
            });
        } else if (pathname === '/api/pulpits/pulpit') {
            let pulpit = url.parse(request.url, true).query.id;
            response.writeHead(200, {'Content-Type': 'application/json'});
            console.log(pulpit);
            _db.getPulpit(pulpit).then((records) => {
                if(records.recordset.length === 0)
                    throw 'Кафедра не найдена';
                return records.recordset[0];
            }).then(updatedPulpit => {
                response.end(JSON.stringify(updatedPulpit));
            }).catch(error => {
                HttpHandler.onError(request, response, 500, error);
            });
        } else {
            HttpHandler.onError(request, response, 404, 'Ресурс не найден');
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
                faculty_data = JSON.parse(faculty_data);
                response.writeHead(200, {'Content-Type': 'application/json'});
                _db.createFaculty(faculty_data.faculty, faculty_data.faculty_name).then(() => {
                    response.end(JSON.stringify(faculty_data));
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            });
        } else if (pathname === '/api/pulpits') {
            let pulpit_data = '';
            request.on('data', chunk => {
                pulpit_data += chunk;
            });
            request.on('end', () => {
                pulpit_data = JSON.parse(pulpit_data);
                response.writeHead(200, {'Content-Type': 'application/json'});
                _db.createPulpit(
                    pulpit_data.pulpit,
                    pulpit_data.pulpit_name,
                    pulpit_data.faculty).then(() => {
                    response.end(JSON.stringify(pulpit_data));
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            });
        } else if (pathname === '/api/subjects') {
            let subject_data = '';
            request.on('data', chunk => {
                subject_data += chunk;
            });
            request.on('end', () => {
                subject_data = JSON.parse(subject_data);
                response.writeHead(200, {'Content-Type': 'application/json'});
                _db.createSubject(
                    subject_data.subject,
                    subject_data.subject_name,
                    subject_data.pulpit
                ).then(() => {
                    response.end(JSON.stringify(subject_data));
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            });
        } else if (pathname === '/api/auditoriumstypes') {
            let auditorium_type_data = '';
            request.on('data', chunk => {
                auditorium_type_data += chunk;
            });
            request.on('end', () => {
                auditorium_type_data = JSON.parse(auditorium_type_data);
                response.writeHead(200, {'Content-Type': 'application/json'});
                _db.createAuditoriumType(
                    auditorium_type_data.auditorium_type,
                    auditorium_type_data.auditorium_typename
                ).then(() => {
                    response.end(JSON.stringify(auditorium_type_data));
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            });
        } else if (pathname === '/api/auditoriums') {
            let auditorium_data = '';
            request.on('data', chunk => {
                auditorium_data += chunk;
            });
            request.on('end', () => {
                auditorium_data = JSON.parse(auditorium_data);
                response.writeHead(200, {'Content-Type': 'application/json'});
                _db.createAuditorium(
                    auditorium_data.auditorium,
                    auditorium_data.auditorium_name,
                    auditorium_data.auditorium_capacity,
                    auditorium_data.auditorium_type,
                ).then(() => {
                    response.end(JSON.stringify(auditorium_data));
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            });
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
                faculty_data = JSON.parse(faculty_data);
                response.writeHead(200, {'Content-Type': 'application/json'});
                _db.getFaculty(faculty_data.faculty).then((records) => {
                    if(records.recordset.length === 0)
                        throw 'Факультет не найден';
                    return records.recordset[0];
                }).then(updatedFaculty => {
                    updatedFaculty.FACULTY_NAME = faculty_data.faculty_name;
                    _db.updateFaculty(updatedFaculty.FACULTY, updatedFaculty.FACULTY_NAME).then(() => {
                        response.end(JSON.stringify(updatedFaculty));
                    }).catch(error => {
                        HttpHandler.onError(request, response, 500, error);
                    });
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            });
        } else if (pathname === '/api/pulpits') {
            let pulpit_data = '';
            request.on('data', chunk => {
                pulpit_data += chunk;
            });
            request.on('end', () => {
                pulpit_data = JSON.parse(pulpit_data);
                response.writeHead(200, {'Content-Type': 'application/json'});
                _db.getPulpit(pulpit_data.pulpit).then((records) => {
                    if(records.recordset.length === 0)
                        throw 'Кафедра не найдена';
                    return records.recordset[0];
                }).then(updatedPulpit => {
                    updatedPulpit.PULPIT_NAME = pulpit_data.pulpit_name;
                    updatedPulpit.FACULTY = pulpit_data.faculty;
                    _db.updatePulpit(
                        updatedPulpit.PULPIT,
                        updatedPulpit.PULPIT_NAME,
                        updatedPulpit.FACULTY
                    ).then(() => {
                        response.end(JSON.stringify(updatedPulpit));
                    }).catch(error => {
                        HttpHandler.onError(request, response, 500, error);
                    });
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            });
        } else if (pathname === '/api/subjects') {
            let subject_data = '';
            request.on('data', chunk => {
                subject_data += chunk;
            });
            request.on('end', () => {
                subject_data = JSON.parse(subject_data);
                response.writeHead(200, {'Content-Type': 'application/json'});
                _db.getSubject(subject_data.subject).then((records) => {
                    if(records.recordset.length === 0)
                        throw 'Предмет не найден';
                    return records.recordset[0];
                }).then(updatedSubject => {
                    updatedSubject.SUBJECT_NAME = subject_data.subject_name;
                    updatedSubject.PULPIT = subject_data.pulpit;
                    _db.updateSubject(
                        updatedSubject.SUBJECT,
                        updatedSubject.SUBJECT_NAME,
                        updatedSubject.PULPIT).then(() => {
                        response.end(JSON.stringify(updatedSubject));
                    }).catch(error => {
                        HttpHandler.onError(request, response, 500, error);
                    });
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            });
        } else if (pathname === '/api/auditoriumstypes') {
            let auditorium_type_data = '';
            request.on('data', chunk => {
                auditorium_type_data += chunk;
            });
            request.on('end', () => {
                auditorium_type_data = JSON.parse(auditorium_type_data);
                response.writeHead(200, {'Content-Type': 'application/json'});
                _db.getAuditoriumType(auditorium_type_data.auditorium_type).then((records) => {
                    if(records.recordset.length === 0)
                        throw 'Тип аудитории не найден';
                    return records.recordset[0];
                }).then(updatedAuditoriumType => {
                    updatedAuditoriumType.AUDITORIUM_TYPENAME = auditorium_type_data.auditorium_typename;
                    _db.updateAuditoriumType(
                        updatedAuditoriumType.AUDITORIUM_TYPE,
                        updatedAuditoriumType.AUDITORIUM_TYPENAME
                    ).then(() => {
                        response.end(JSON.stringify(updatedAuditoriumType));
                    }).catch(error => {
                        HttpHandler.onError(request, response, 500, error);
                    });
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            });
        } else if (pathname === '/api/auditoriums') {
            let auditorium_data = '';
            request.on('data', chunk => {
                auditorium_data += chunk;
            });
            request.on('end', () => {
                auditorium_data = JSON.parse(auditorium_data);
                response.writeHead(200, {'Content-Type': 'application/json'});
                _db.getAuditorium(auditorium_data.auditorium).then((records) => {
                    if(records.recordset.length === 0)
                        throw 'Аудитория не найдена';
                    return records.recordset[0];
                }).then(updatedAuditorium => {
                    updatedAuditorium.AUDITORIUM_NAME = auditorium_data.auditorium_name;
                    updatedAuditorium.AUDITORIUM_CAPACITY = auditorium_data.auditorium_capacity;
                    updatedAuditorium.AUDITORIUM_TYPE = auditorium_data.auditorium_type;
                    _db.updateFaculty(
                        updatedAuditorium.AUDITORIUM,
                        updatedAuditorium.AUDITORIUM_NAME,
                        updatedAuditorium.AUDITORIUM_CAPACITY,
                        updatedAuditorium.AUDITORIUM_TYPE,
                    ).then(() => {
                        response.end(JSON.stringify(updatedAuditorium));
                    }).catch(error => {
                        HttpHandler.onError(request, response, 500, error);
                    });
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            });
        } else {
            HttpHandler.onError(request, response, 404, 'Ресурс не найден');
        }
    }

    static onDelete(request, response) {
        let pathname = url.parse(request.url).pathname.split('/');
        pathname.pop();
        pathname = pathname.join('/');
        const code = url.parse(request.url).pathname.split('/').pop();

        if (pathname === '/api/faculties') {
            response.writeHead(200, {'Content-Type': 'application/json'});
            _db.getFaculty(code).then((records) => {
                if(records.recordset.length === 0)
                    throw 'Факультет не найден';
                return records.recordset[0];
            }).then(deletedFaculty => {
                _db.deleteFaculty(deletedFaculty.FACULTY).then(() => {
                    response.end(JSON.stringify(deletedFaculty));
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            }).catch(error => {
                HttpHandler.onError(request, response, 500, error);
            });
        } else if (pathname === '/api/pulpits') {
            response.writeHead(200, {'Content-Type': 'application/json'});
            _db.getPulpit(code).then((records) => {
                if(records.recordset.length === 0)
                    throw 'Кафедра не найдена';
                return records.recordset[0];
            }).then(deletedPulpit => {
                _db.deletePulpit(deletedPulpit.PULPIT).then(() => {
                    response.end(JSON.stringify(deletedPulpit));
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            }).catch(error => {
                HttpHandler.onError(request, response, 500, error);
            });
        } else if (pathname === '/api/subjects') {
            response.writeHead(200, {'Content-Type': 'application/json'});
            _db.getSubject(code).then((records) => {
                if(records.recordset.length === 0)
                    throw 'Предмет не найден';
                return records.recordset[0];
            }).then(deletedSubject => {
                _db.deleteSubject(deletedSubject.SUBJECT).then(() => {
                    response.end(JSON.stringify(deletedSubject));
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            }).catch(error => {
                HttpHandler.onError(request, response, 500, error);
            });
        } else if (pathname === '/api/auditoriumstypes') {
            response.writeHead(200, {'Content-Type': 'application/json'});
            _db.getAuditoriumType(code).then((records) => {
                if(records.recordset.length === 0)
                    throw 'Тип аудитории не найдена';
                return records.recordset[0];
            }).then(deletedAuditoriumType => {
                _db.deleteAuditoriumType(deletedAuditoriumType.AUDITORIUM_TYPE).then(() => {
                    response.end(JSON.stringify(deletedAuditoriumType));
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            }).catch(error => {
                HttpHandler.onError(request, response, 500, error);
            });
        } else if (pathname === '/api/auditoriums') {
            response.writeHead(200, {'Content-Type': 'application/json'});
            _db.getAuditorium(code).then((records) => {
                if(records.recordset.length === 0)
                    throw 'Аудитория не найдена';
                return records.recordset[0];
            }).then(deletedAuditorium => {
                _db.deleteAuditorium(deletedAuditorium.AUDITORIUM).then(() => {
                    response.end(JSON.stringify(deletedAuditorium));
                }).catch(error => {
                    HttpHandler.onError(request, response, 500, error);
                });
            }).catch(error => {
                HttpHandler.onError(request, response, 500, error);
            });
        } else {
            HttpHandler.onError(request, response, 404, 'Ресурс не найден');
        }
    }

    static onError(request, response, code, message) {
        response.writeHead(code, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(`{"error": "${code}", "message": "${message}"}`);
    }
}
