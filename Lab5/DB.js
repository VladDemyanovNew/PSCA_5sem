import EventEmitter from "events";

let users = [
    {id: 0, name: "VLad", bday: "2002-02-03"},
    {id: 1, name: "Peter", bday: "2002-02-03"},
    {id: 2, name: "Alice", bday: "2002-02-03"},
    {id: 3, name: "Andrey", bday: "2002-02-03"}
];

let stat = {
    reqCount: 0,
    commitCount: 0,
    startDate: null,
    finishDate: null
}

export default class DB extends EventEmitter {
    #statMode = false;


    turnOnStatMode(){
        this.#statMode = true;
    }

    turnOffStatMode(){
        this.#statMode = false;
    }

    select() {
        return users;
    }

    insert(insetedUser) {
        users.push(insetedUser);
    }

    update(updatedUser) {
        let index = users.findIndex(user => user.id === updatedUser.id);
        if (index != -1) {
            console.log(index);
            users[index] = updatedUser;
            console.log(users);
        }
    }

    delete(id) {
        let index = users.findIndex(user => user.id === id);
        console.log(index);
        if (index != -1) {
            users.splice(id, 1);
            return users[index];
        }

    }

    getUserById(id) {
        let index = users.findIndex(user => user.id === id);
        if (index != -1)
            return users[index];
    }

    getUsersLength() {
        return users.length;
    }

    commit() {
        console.log("commit bd");
        if (this.#statMode)
            stat.commitCount++;
    }

    increaseReqCount() {
        if (this.#statMode)
            stat.reqCount++;
    }

    setStartDate(date) {
        stat.startDate = date;
    }

    setFinishDate(date) {
        stat.finishDate = date;
    }

    setReqCount(count) {
        stat.reqCount = count;
    }

    setCommitCount(count) {
        stat.commitCount = count;
    }

    getStat() {
        return stat;
    }
}