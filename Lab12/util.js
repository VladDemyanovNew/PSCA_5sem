import fs from 'fs';

const filePath = './static/StudentList.json';

export function readFile() {
    try {
        return fs.readFileSync(filePath).toString();
    } catch (e) {
        console.log(e);
        return null;
    }

}

export function writeFile(data) {
    try {
        fs.writeFileSync(filePath, data);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export function copyFile() {
    let flag = true;
    setTimeout(() => {
        fs.copyFile(filePath, `./static/backup/${configFileName()}`, (error) => {
            if (error)
                flag = false;
        });
    }, 2000);
    return flag;
}

export function deleteAllBackupFiles(date) {
    let flag = true;
    fs.readdir('./static/backup', (err, files) => {
        files.forEach(file => {
            let yyyymmdd = file.slice(0, 8);
            if (parseInt(yyyymmdd, 10) > parseInt(date, 10)) {
                fs.unlink(`./static/backup/${file}`, (error) => {
                    if (error)
                        flag = false;
                });
            }
        });
    });
    return flag;
}

export function getAllBackupFiles() {
    let files = fs.readdirSync('./static/backup');
    return JSON.stringify(files);
}

function configFileName() {
    let date = new Date();
    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    return `${date.getFullYear()}${month}${day}${date.getHours()}${date.getMinutes()}${date.getSeconds()}_StudentList.json`;
}