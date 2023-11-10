import * as SQLite from 'expo-sqlite';
import { VARIABLES } from './config';

const db = SQLite.openDatabase('db.testDb');

async function setup_variables(){
    try{
        const db_version_result = await get_config_item('db_version');
        if(db_version_result.success){
            console.log("db_version = ");
            console.log(db_version_result.data);
            VARIABLES.DB_VERSION = db_version_result.data;
            const user_token_result = await get_config_item('user_token');
            if(user_token_result.success){
                console.log("user_token = ");
                console.log(user_token_result.data);
                VARIABLES.user_token = user_token_result.data;
                const trail_id_result = await get_config_item('trail_id');
                if(trail_id_result.success){
                    console.log("trail_id = ");
                    console.log(trail_id_result.data);
                    VARIABLES.trail_id = trail_id_result.data;
                    return {
                        success: true
                    }
                }else{
                    return {
                        success: false,
                        error: trail_id_result.error
                    }
                }
            }else{
                return {
                    success: false,
                    error: user_token_result.error
                }
            }
        }else{
            return {
                success: false,
                error: db_version_result.error
            }
        }
    }catch(error){
        return {
            success: false,
            error: error
        }
    }
}

async function setup_config(){
    return new Promise((resolve, reject)=>{
        db.transaction(async tx => {
            try{
                await new Promise((resolve,reject)=>{
                    tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS config(id INTEGER PRIMARY KEY, db_version TEXT, user_token TEXT, trail_id TEXT)',
                        [],
                        (obj,rs)=>{
                            console.log("table created");
                            resolve();
                        },
                        (obj,error)=>{
                            reject(error);
                        }
                    )
                });
            }catch(error){
                reject({
                    success: false,
                    error: error
                });
            }
        },(e)=>{
            console.log("Error DB: " + e);
            reject({
                success: false,
                error: e
            });
        },async ()=>{
            console.log("config table created");
            const table_has_data = await check_if_table_has_data('config');
            if(table_has_data.success){
                console.log("table_has_data = ");
                console.log(table_has_data);
                const count = table_has_data.data;
                console.log(table_has_data.data);
                console.log("count = " + count);
                if(count === 0){
                    console.log("config table has no data");
                    const populate = await populate_initial_config();
                    if(populate.success === false){
                        reject({
                            success: false,
                            error: populate.error
                        });
                    }
                }
                console.log("table has data");
                const test = await setup_variables();
                if(test.success){
                    console.log("variables configured");
                    resolve({
                        success: true
                    });
                }else{
                    resolve({
                        success: false,
                        error: test.error
                    });
                }
            }
        });
    });
}

async function setup(){
    console.log("setup called");
    return new Promise((resolve,reject)=>{
        db.transaction(async tx =>{
            try{
                await new Promise((resolve, reject)=>{
                    tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS trail(id INTEGER PRIMARY KEY, name TEXT, description TEXT, mileage REAL, rating INTEGER, is_wheelchair_accessible INTEGER, image_URL TEXT, audio_URL TEXT)',
                        [],
                        (obj,rs)=>{
                            resolve();
                        },
                        (obj,error)=>{
                            reject(error);
                        }
                    )
                });
                await new Promise((resolve, reject)=>{
                    tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS trailchecklist(id INTEGER PRIMARY KEY, item TEXT, trailId INTEGER)',
                        [],
                        (obj,rs)=>{
                            resolve();
                        },
                        (obj,error)=>{
                            reject(error);
                        }
                    )
                });
            }catch(error){
                reject({
                    success: false,
                    error: error
                });
            }
        },(e)=>{
            console.log("Error DB: " + e);
            reject({
                success: false,
                error: e
            });
        },async ()=>{
            console.log("end of setup");
            console.log("tables created");

            const trail_empty_result = await empty_table('trail');

            if(trail_empty_result.success){
                console.log("trail empty");
                const check_list_empty_result = await empty_table('trailchecklist');
                if(check_list_empty_result.success){
                    console.log("checklist trail empty");
                    resolve({
                        success: true
                    });
                }else{
                    reject({
                        success: false,
                        error: check_list_empty_result.error
                    });
                }
            }else{
                reject({
                    success: false,
                    error: trail_empty_result.error
                })
            }
        });
    });
}

async function empty_table(table_name) {
    const st = "DELETE FROM " + table_name;

    return new Promise((resolve, reject) => {
        db.transaction(async tx => {
            try {
                const result = await new Promise((resolve, reject) => {
                    tx.executeSql(st, null,
                        (obj, rs) => {
                            resolve({
                                'success': true
                            });
                        },
                        (error) => {
                            reject({
                                'success': false,
                                'error': error
                            });
                        }
                    );
                });

                resolve(result);
            } catch (error) {
                reject({
                    'success': false,
                    'error': error
                });
            }
        }, (e) => {
            console.log("ErrorDB: " + e);
            reject({
                'success': false,
                'error': e
            });
        }, () => {
            console.log("tables emptied");
            resolve({
                'success': true
            });
        });
    });
}

async function check_if_table_has_data(table_name) {
    const st = "SELECT COUNT(*) FROM " + table_name;

    return new Promise((resolve, reject) => {
        db.exec([{sql: st,args:[]}],true,(err,res)=>{
            if(err){
                return reject({
                    success: false,
                    error: err
                })
            }

            if(res[0].error){
                return reject({
                    success: false,
                    error: res[0].error
                })
            }

            resolve({
                success: true,
                data: res[0]["rows"][0]["COUNT(*)"]
            });
        });
    });
}

async function update_config(item, new_value) {
    console.log("update config called");
    return new Promise((resolve, reject) => {
        const st = "UPDATE config SET " + item + "='" + new_value + "' WHERE id=1";
        console.log("st = " + st);
        db.transaction(async tx => {
            try {
                await new Promise((resolve, reject) => {
                    tx.executeSql(st, null,
                        (txObj, rs) => {
                            resolve({
                                success: true
                            });
                        },
                        (txObj, error) => {
                            reject({
                                success: false,
                                error: error
                            });
                        }
                    );
                });

                resolve({ success: true });
            } catch (error) {
                reject({ success: false, error: error });
            }
        }, (e) => {
            console.log("Error: " + e);
            reject({ success: false, error: e });
        },()=>{
            resolve({
                success: true
            });
        });
    });
}

async function populate_initial_config(){
    return new Promise((resolve,reject)=>{
        db.transaction(async tx=>{
            try{
                const res = await new Promise((resolve,reject)=>{
                    tx.executeSql(
                        'INSERT INTO config(db_version, user_token, trail_id) VALUES(?,?,?)',
                        [
                            '1',
                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk5MDUzNzI4LCJleHAiOjE2OTk2NTg1Mjh9.PfRK6rC9sYOOQiNslyv3W0yvJlciN5pUs_1DUrSxrCo',
                            '-1'
                        ],
                        (obj,rs)=>{
                            resolve({
                                'success': true,
                                'data': rs
                            });
                        },
                        (obj,error)=>{
                            reject({
                                'success': false,
                                'error': error
                            });
                        }
                    );
                });
                resolve(result);
            }catch(error){
                reject({
                    'success': false,
                    'error': error
                });
            }
        },(e)=>{
            console.log("ErrorDB: " + e);
            reject({
                success: false,
                error: e
            });
        },()=>{
            console.log("initial table populated");
        });
    });
}

async function get_config_item(item)
{
    const st = "SELECT " + item + " FROM config WHERE id=1";
    console.log("st = " + st);
    return new Promise((resolve,reject)=>{
        db.exec([{sql: st, args:[]}],true,(err,res)=>{
            if(err){
                return reject({
                    success: false,
                    error: err
                })
            }

            if(res[0].error){
                return reject({
                    success: false,
                    error: res[0].error
                })
            }
            console.log("res = ");
            console.log(res[0]["rows"][0][item]);

            resolve({
                success: true,
                data: res[0]["rows"][0][item]
            });
        });
    });
}

async function add_trail_checklist_data(data) {
    console.log("add trail checklist called");
    return new Promise((resolve, reject) => {
        db.transaction(async tx => {
            try {
                await new Promise((resolve, reject) => {
                    tx.executeSql(
                        'INSERT INTO trailchecklist(item,trailId) VALUES(?,?)',
                        [
                            data.item,
                            data.trailId
                        ],
                        (txObj, resultSet) => {
                            resolve({
                                success: true
                            });
                        },
                        (txObj, error) => {
                            console.log("ErrorDB: " + error);
                            reject({ "success": false, "error": error });
                        }
                    );
                });

                resolve({ "success": true });
            } catch (error) {
                reject({ "success": false, "error": error });
            }
        }, (e) => {
            console.log("Error: " + e);
            reject({ "success": false, "error": e });
        }, () => {
            resolve({
                success: true
            });
        });
    });
}

async function add_trail_data(data) {
    console.log("add trail data");
    return new Promise((resolve, reject) => {
        db.transaction(async tx => {
            try {
                await new Promise((resolve, reject) => {
                    tx.executeSql(
                        'INSERT INTO trail(id,name,description,mileage,rating,is_wheelchair_accessible,image_URL,audio_URL) VALUES(?,?,?,?,?,?,?,?)',
                        [
                            data.id,
                            data.name,
                            data.description,
                            data.mileage,
                            data.rating,
                            data.is_wheelchair_accessible,
                            data.image_URL,
                            data.audio_URL
                        ],
                        (txObj, resultSet) => {
                            console.log("resultSet = ");
                            console.log(resultSet);
                            resolve({
                                success: true
                            });
                        },
                        (txObj, error) => {
                            console.log("Error DB: " + error);
                            reject({ "success": false, "error": error });
                        }
                    );
                });

                resolve({ "success": true });
            } catch (error) {
                reject({ "success": false, "error": error });
            }
        }, (e) => {
            console.log("Error: " + e);
            reject({ "success": false, "error": e });
        }, () => {
            console.log("data inserted");
            resolve({
                success: true
            });
        });
    });
}

async function get_all_trails() {
    console.log("get all trails called");
    const st = "SELECT id,name FROM trail";
    console.log("st = " + st);
    return new Promise((resolve,reject)=>{
        db.exec([{sql: st, args:[]}],true,(err,res)=>{
            if(err){
                return reject({
                    success: false,
                    error: err
                })
            }

            if(res[0].error){
                return reject({
                    success: false,
                    error: res[0].error
                })
            }
            console.log("res = ");
            console.log(res[0]['rows']);

            resolve({
                success: true,
                data: res[0]["rows"]
            });
        });
    });
}

async function get_trail_by_id(trail_id) {
    console.log("get trail by id");
    const st = 'SELECT name, description, mileage, rating, is_wheelchair_accessible, image_URL, audio_URL FROM trail WHERE id=' + trail_id;
    return new Promise((resolve,reject)=>{
        db.exec([{sql: st, args:[]}],true,(err,res)=>{
            if(err){
                return reject({
                    success: false,
                    error: err
                })
            }

            if(res[0].error){
                return reject({
                    success: false,
                    error: res[0].error
                })
            }
            console.log("res = ");
            console.log(res[0]['rows']);

            resolve({
                success: true,
                data: res[0]["rows"]
            });
        });
    });
    /*return new Promise((resolve, reject) => {
        db.transaction(async tx => {
            try {
                const resultSet = await new Promise((resolve, reject) => {
                    tx.executeSql(
                        'SELECT name, description, mileage, rating, is_wheelchair_accessible, image_URL, audio_URL FROM trail WHERE id=?',
                        [trail_id],
                        (txObj, resultSet) => {
                            resolve(resultSet);
                        },
                        (txObj, error) => {
                            reject(error);
                        }
                    );
                });

                resolve({
                    success: true,
                    data: resultSet
                });
            } catch (error) {
                reject({
                    success: false,
                    error: error
                });
            }
        });
    });*/
}

async function get_checklist_for_trail(trail_id) {
    console.log("get checklist for trail called");
    const st = 'SELECT item FROM trailchecklist WHERE trailId=' + trail_id;
    return new Promise((resolve,reject)=>{
        db.exec([{sql: st, args:[]}],true,(err,res)=>{
            if(err){
                return reject({
                    success: false,
                    error: err
                })
            }

            if(res[0].error){
                return reject({
                    success: false,
                    error: res[0].error
                })
            }
            console.log("res = ");
            console.log(res[0]['rows']);

            resolve({
                success: true,
                data: res[0]["rows"]
            });
        });
    });
    /*return new Promise((resolve, reject) => {
        db.transaction(async tx => {
            try {
                const resultSet = await new Promise((resolve, reject) => {
                    tx.executeSql(
                        'SELECT item FROM trailchecklist WHERE trailId=?',
                        [trail_id],
                        (txObj, resultSet) => {
                            resolve(resultSet);
                        },
                        (txObj, error) => {
                            reject(error);
                        }
                    );
                });

                resolve({
                    success: true,
                    data: resultSet
                });
            } catch (error) {
                reject({
                    success: false,
                    error: error
                });
            }
        });
    });*/
}

export {
    add_trail_checklist_data,
    add_trail_data, get_all_trails, get_checklist_for_trail, get_config_item, get_trail_by_id,
    setup, setup_config, update_config
};

