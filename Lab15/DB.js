import {MongoClient} from "mongodb";
const uri = 'mongodb+srv://vdemyanov:psca2021@bstu.9p6cw.mongodb.net/BSTU?retryWrites=true&w=majority';

export default class DB {
    #client;

    constructor() {
        this.#client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
            .connect()
            .then(connection => {
                console.log('Соединение с БД установлено');
                return connection.db();
            })
            .catch(error => {
                console.log('Ошибка соединения с БД: ', error);
            });
    }

    getAll(collectionName) {
        return this.#client.then(db => {
            return db.collection(collectionName)
                .find({})
                .toArray();
        });
    }

    findOne(collectionName, filter) {
        return this.#client.then(db => {
            return db.collection(collectionName)
                .findOne(filter);
        });
    }

    async create(collectionName, value) {
        if (collectionName === 'pulpit') {
            const doesFacultyExist = (await this.findOne('faculty', { 'faculty': value.faculty })) !== null;
            if (doesFacultyExist) {
                return this.#client.then(db => {
                    return db.collection(collectionName)
                        .insertOne(value)
                        .then(() => {
                            return value;
                        });
                });
            } else {
                throw new Error('Заданныый факультет не существует');
            }
        } else if (collectionName === 'faculty') {
            return this.#client.then(db => {
                return db.collection(collectionName)
                    .insertOne(value)
                    .then(() => {
                        return value;
                    });
            });
        }
    }

    update(collectionName, filter, value) {
        return this.#client.then(db => {
            return db.collection(collectionName)
                .findOneAndUpdate(
                    filter,
                    { $set: value },
                    { 'returnDocument' : 'after' }
                )
                .then(result => {
                    return result.value;
                });
        });
    }

    delete(collectionName, filter) {
        return this.#client.then(db => {
           return db.collection(collectionName)
               .findOneAndDelete(filter)
               .then(result => {
                   return result.value;
               });
        });
    }

    close() {
        this.#client.close();
    }
}