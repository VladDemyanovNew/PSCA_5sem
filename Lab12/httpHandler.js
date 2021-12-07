import url from 'url';
import {copyFile, deleteAllBackupFiles, getAllBackupFiles, readFile, writeFile} from "./util.js";

export default class HttpHandler {

    static async onGet(request, response) {
        const pathname = url.parse(request.url).pathname;
        if (pathname === '/') {
            let result = readFile();
            if (result) {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(result);
            } else {
                HttpHandler.onError(request, response, 500, 'Ошибка чтения файла');
            }
        } else if (new RegExp('\/[0-9]*$').test(pathname)) {
            let id = pathname.split('/').pop();
            let student = JSON.stringify(JSON.parse(readFile()).find(item => item.id.toString() === id));
            if (student) {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(student);
            } else {
                HttpHandler.onError(request, response, 500, `Студент с id ${id} не найден`);
            }
        } else if (pathname === '/backup') {
            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            response.end(getAllBackupFiles());
        } else {
            HttpHandler.onError(request, response, 404, 'Ресурс не найден');
        }
    }

    static onPost(request, response) {
        const pathname = url.parse(request.url).pathname;
        if (pathname === '/') {
            let student;
            let students;
            request.on('data', (chunk) => {
                student = JSON.parse(chunk);
                students = JSON.parse(readFile());
                if (students.find(item => item.id === student.id)) {
                    HttpHandler.onError(request, response, 500, `Студент с id ${student.id} уже есть`);
                } else {
                    students.push(student);
                    if (writeFile(JSON.stringify(students))) {
                        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        response.end(JSON.stringify(student));
                    } else {
                        HttpHandler.onError(request, response, 500, 'Ошибка записи в файл');
                    }
                }
            });
        } else if (pathname === '/backup') {
            if (copyFile()) {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(JSON.stringify({code: '200', message: 'Копия создана'}));
            } else {
                HttpHandler.onError(request, response, 500, 'Ошибка копирования файла');
            }
        } else {
            HttpHandler.onError(request, response, 404, 'Ресурс не найден');
        }
    }

    static onPut(request, response) {
        const pathname = url.parse(request.url).pathname;
        if (pathname === '/') {
            let student;
            let students;
            request.on('data', (chunk) => {
                student = JSON.parse(chunk);
                students = JSON.parse(readFile());
                let updatedIndex = students.findIndex(item => item.id === student.id);
                if (updatedIndex === -1) {
                    HttpHandler.onError(request, response, 500, `Студент с id ${student.id} не найден`);
                } else {
                    students[updatedIndex] = student;
                    if (writeFile(JSON.stringify(students))) {
                        response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                        response.end(JSON.stringify(student));
                    } else {
                        HttpHandler.onError(request, response, 500, 'Ошибка записи в файл');
                    }
                }
            });
        } else {
            HttpHandler.onError(request, response, 404, 'Ресурс не найден');
        }
    }

    static onDelete(request, response) {
        const pathname = url.parse(request.url).pathname;
        console.log(pathname);
        if (new RegExp('^\/[0-9]*$').test(pathname)) {
            let id = pathname.split('/').pop();
            let students = JSON.parse(readFile());
            let deletedIndex = students.findIndex(item => item.id.toString() === id.toString());
            if (deletedIndex !== -1) {
                let student = students.splice(deletedIndex, 1);
                if (writeFile(JSON.stringify(students))) {
                    response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                    response.end(JSON.stringify(student));
                } else {
                    HttpHandler.onError(request, response, 500, 'Ошибка записи в файл');
                }
            } else {
                HttpHandler.onError(request, response, 500, `Студент с id ${id} не найден`);
            }
        } else if (new RegExp('^\/backup\/[0-9]{8}$').test(pathname)) {
            let date = pathname.split('/').pop();
            if (deleteAllBackupFiles(date)) {
                response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
                response.end(JSON.stringify({code: '200', message: 'Удаление backup-ов прошло успешно'}));
            } else {
                HttpHandler.onError(request, response, 500, 'Ошибка удаления файлов');
            }
        } else {
            HttpHandler.onError(request, response, 404, 'Ресурс не найден');
        }
    }

    static onError(request, response, code, message) {
        response.writeHead(code, {'Content-Type': 'application/json; charset=utf-8'});
        response.end(`{"error": "${code}", "message": "${message}"}`);
    }
}