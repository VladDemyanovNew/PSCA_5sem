
export default class Util {
    #timerSD = null;
    #timerSC = null;
    #timerSS = null;
    #server = null;
    #dbInstance = null;

    constructor(server, dbInstance) {
        this.#server = server;
        this.#dbInstance = dbInstance;
    }

    sd(sec) {
        if (!isNaN(sec)) {
            clearTimeout(this.#timerSD);
            console.log(`Сервер будет остановлен через ${sec}с`);
            this.#timerSD = setTimeout(()=>{
                console.log("Сервер остановлен.");
                this.#server.close();
            }, sec * 1000);
            this.#timerSD.unref();
        } else if (sec === undefined) {
            console.log("Остановка сервера прекращена.");
            clearTimeout(this.#timerSD);
        } else {
            console.log("Введите правильно команду sd: sd x (где x - секунды) или sd");
        }
    }

    sc(sec) {
        if (!isNaN(sec)) {
            clearTimeout(this.#timerSC);
            console.log(`Запущен режим авто-фиксации каждые ${sec}с`);
            this.#timerSC = setInterval(()=>{
                this.#dbInstance.emit("COMMIT");
            }, sec * 1000);
            this.#timerSC.unref();
        } else if (sec === undefined) {
            console.log("Режим авто-фиксации отключён.");
            clearTimeout(this.#timerSC);
        } else {
            console.log("Введите правильно команду sc: sc x (где x - секунды) или sc");
        }
    }

    ss(sec) {
        if (!isNaN(sec)) {
            clearTimeout(this.#timerSS);
            console.log(`Сбор статистики ${sec}с`);
            this.#dbInstance.setStartDate(new Date());
            this.#dbInstance.setReqCount(null);
            this.#dbInstance.setCommitCount(null);
            this.#dbInstance.setFinishDate(null);
            this.#dbInstance.turnOnStatMode();

            this.#timerSS = setTimeout(()=>{
                this.#dbInstance.setFinishDate(new Date());
                this.#dbInstance.turnOffStatMode();
                console.log("Сбор статистики остановлен");
            }, sec * 1000);

            this.#timerSS.unref();
        } else if (sec === undefined) {
            console.log("Сбор статистики остановлен");
            clearTimeout(this.#timerSS);
            this.#dbInstance.turnOffStatMode();
            this.#dbInstance.setFinishDate(new Date());
        } else {
            console.log("Введите правильно команду ss: ss x (где x - секунды) или ss");
        }
    }
}