import * as SQLite from 'expo-sqlite';
import { VARIABLES } from './config';

const db = SQLite.openDatabase('db.testDb');

// setup db_version, user_token, trail_id
async function setup_variables(){
    try{
        // get db_version
        const db_version_result = await get_config_item('db_version');
        // check if db version retrieval worked
        if(db_version_result.success){
            // retrieval worked
            console.log("db_version = ");
            console.log(db_version_result.data);
            // set DB_VERSION varaible
            VARIABLES.DB_VERSION = db_version_result.data;
            // get user_token
            const user_token_result = await get_config_item('user_token');
            // check if user token retrieval worked
            if(user_token_result.success){
                // user retrieval worked
                console.log("user_token = ");
                console.log(user_token_result.data);
                // set variables
                VARIABLES.user_token = user_token_result.data;
                // get trail id
                const trail_id_result = await get_config_item('trail_id');
                if(trail_id_result.success){
                    // check if trail id retrieval worked
                    console.log("trail_id = ");
                    console.log(trail_id_result.data);
                    // set trail id variable
                    VARIABLES.trail_id = trail_id_result.data;
                    return {
                        success: true
                    }
                }else{
                    // trail id retrieval failed
                    console.log("Error: ");
                    console.log(trail_id_result.error);
                    return {
                        success: false,
                        error: trail_id_result.error
                    }
                }
            }else{
                // user token retrieval failed
                console.log("Error: ");
                console.log(user_token_result.error);
                return {
                    success: false,
                    error: user_token_result.error
                }
            }
        }else{
            // db version retrieval failed
            console.log("Error: ");
            console.log(db_version_result.error);
            return {
                success: false,
                error: db_version_result.error
            }
        }
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            success: false,
            error: error
        }
    }
}

// create config table and populate data and setup variables
async function setup_config(){
    try{
        return new Promise((resolve, reject)=>{
            db.transaction(async tx => {
                try{
                    // create config table
                    await new Promise((resolve,reject)=>{
                        tx.executeSql(
                            'CREATE TABLE IF NOT EXISTS config(id INTEGER PRIMARY KEY, db_version TEXT, user_token TEXT, trail_id TEXT)',
                            [],
                            (obj,rs)=>{
                                console.log("table created");
                                resolve();
                            },
                            (obj,error)=>{
                                console.log("Error: ");
                                console.log(error);
                                reject(error);
                            }
                        )
                    });
                }catch(error){
                    // config table creation filed
                    console.log("Error: ");
                    console.log(error);
                    reject({
                        success: false,
                        error: error
                    });
                }
            },(e)=>{
                // create table config failed
                console.log("Error DB: " + e);
                reject({
                    success: false,
                    error: e
                });
            },async ()=>{
                console.log("config table created");
                // check if config table has data
                const table_has_data = await check_if_table_has_data('config');
                if(table_has_data.success){
                    // checked worked
                    console.log("table_has_data = ");
                    console.log(table_has_data);
                    // get table count
                    const count = table_has_data.data;
                    console.log(table_has_data.data);
                    console.log("count = " + count);
                    // table is empty
                    if(count === 0){
                        console.log("config table has no data");
                        // populate config table with initial data
                        const populate = await populate_initial_config();
                        // populating data failed
                        if(populate.success === false){
                            console.log("Error: ");
                            console.log(populate.error);
                            reject({
                                success: false,
                                error: populate.error
                            });
                        }
                    }
                    console.log("table has data");
                    // setup variables
                    const test = await setup_variables();
                    if(test.success){
                        // variables configured
                        console.log("variables configured");
                        resolve({
                            success: true
                        });
                    }else{
                        // variable configuration failed
                        console.log("Error: ");
                        console.log(test.error);
                        resolve({
                            success: false,
                            error: test.error
                        });
                    }
                }
            });
        });
    }catch(err){
        console.log("Error: ");
        console.log(err);
        return {
            'success': false,
            'error': err
        }
    }
}

// create trail table
async function create_trail_table(){
    try{
        // SQL statement
        const st = "CREATE TABLE IF NOT EXISTS trail(id INTEGER PRIMARY KEY, name TEXT, description TEXT, mileage REAL, rating INTEGER, is_wheelchair_accessible INTEGER, image_URL TEXT,image_URL2 TEXT,image_URL3 TEXT,image_URL4 TEXT,image_URL5 TEXT, audio_URL TEXT)";
        console.log("st = " + st);

        return new Promise((resolve, reject) => {
            // execute SQL statement
            db.exec([{sql: st,args:[]}],false,(err,res)=>{
                // check if error
                if(err){
                    console.log("Error: ");
                    console.log(err);
                    return reject({
                        success: false,
                        error: err
                    })
                }

                if(res[0].error){
                    console.log("Error: ");
                    console.log(res[0].error);
                    return reject({
                        success: false,
                        error: res[0].error
                    })
                }

                // table creation worked
                console.log("created trial table");
                resolve({
                    success: true
                });
            });
        });
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

// create trail checklist table
async function create_trail_checklist_table(){
    try{
        // sql statement
        const st = "CREATE TABLE IF NOT EXISTS trailchecklist(id INTEGER PRIMARY KEY, item TEXT, trailId INTEGER)";
        console.log("st = " + st);

        return new Promise((resolve, reject) => {
            // execute sql statement
            db.exec([{sql: st,args:[]}],false,(err,res)=>{
                // check if error
                if(err){
                    console.log("Error: ");
                    console.log(err);
                    return reject({
                        success: false,
                        error: err
                    })
                }

                if(res[0].error){
                    console.log("error: ");
                    console.log(res[0].error);
                    return reject({
                        success: false,
                        error: res[0].error
                    })
                }

                // create trail checklist table worked
                console.log("created trail check list table");
                resolve({
                    success: true
                });
            });
        });
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

// create trail table, trail checklist table
// and empty tables
async function setup(){
    console.log("setup called");

    try{
        // create trail table
        console.log("create trail table");
        const create_trail_table_result = await create_trail_table();
        if(create_trail_table_result.success)
        {
            // trail table created
            console.log("trail table created");
            const create_trail_checklist_table_res = await create_trail_checklist_table();

            if(create_trail_checklist_table_res.success){
                // create trail checklist worked
                console.log("trail checklist table created");
                // empty trail
                const trail_empty_result = await empty_table('trail');

                if(trail_empty_result.success){
                    console.log("trail empty");
                    // empty checklist
                    const check_list_empty_result = await empty_table('trailchecklist');
                    if(check_list_empty_result.success){
                        // checklist trail empty worked
                        console.log("checklist trail empty");
                        return {
                            success: true
                        }
                    }else{
                        // check list empty error
                        console.log("error: ");
                        console.log(check_list_empty_result.error);
                        return {
                            success: false,
                            error: check_list_empty_result.error
                        }
                    }
                }else{
                    // empty trail table error
                    console.log("error: ");
                    console.log(trail_empty_result.error);
                    return {
                        success: false,
                        error: trail_empty_result.error
                    }
                }
            }else{
                // create trail checklist table error
                console.log("error: ");
                console.log(create_trail_checklist_table_res.error);
                return {
                    success: false,
                    error: create_trail_checklist_table_res.error
                }
            }
        }else{
            // trail table create error
            console.log("Error: ");
            console.log(create_trail_table_result.error);
            return {
                success: false,
                error: create_trail_table_result.error
            }
        }
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            success: false,
            error: error
        }
    }
}

// empty table with table_name
async function empty_table(table_name) {
    try{
        // sql statement
        const st = "DELETE FROM " + table_name;
        console.log("st = " + st);

        return new Promise((resolve, reject) => {
            // execute sql statement
            db.exec([{sql: st,args:[]}],false,(err,res)=>{
                // check if error
                if(err){
                    console.log("Error: ");
                    console.log(err);
                    return reject({
                        success: false,
                        error: err
                    })
                }

                if(res[0].error){
                    console.log("Error: ");
                    console.log(res[0].error);
                    return reject({
                        success: false,
                        error: res[0].error
                    })
                }

                // check if table is empty
                console.log("table empty: " + table_name);
                resolve({
                    success: true
                });
            });
        });
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

// check if table has data
async function check_if_table_has_data(table_name) {
    try{
        // sql statement
        const st = "SELECT COUNT(*) FROM " + table_name;

        return new Promise((resolve, reject) => {
            // execute sql statement
            db.exec([{sql: st,args:[]}],true,(err,res)=>{
                // check if error
                if(err){
                    console.log("Error: ");
                    console.log(err);
                    return reject({
                        success: false,
                        error: err
                    })
                }

                if(res[0].error){
                    console.log("Error: ");
                    console.log(res[0].error);
                    return reject({
                        success: false,
                        error: res[0].error
                    })
                }

                // return count
                resolve({
                    success: true,
                    data: res[0]["rows"][0]["COUNT(*)"]
                });
            });
        });
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

// update config value
async function update_config(item, new_value) {
    try{
        console.log("update config called");
        return new Promise((resolve, reject) => {
            // sql statement
            // update item with new_value
            const st = "UPDATE config SET " + item + "='" + new_value + "' WHERE id=1";
            console.log("st = " + st);
            db.transaction(async tx => {
                try {
                    await new Promise((resolve, reject) => {
                        tx.executeSql(st, null,
                            (txObj, rs) => {
                                // update worked
                                resolve({
                                    success: true
                                });
                            },
                            (txObj, error) => {
                                // update failed
                                console.log("error: ");
                                console.log(error);
                                reject({
                                    success: false,
                                    error: error
                                });
                            }
                        );
                    });

                    resolve({ success: true });
                } catch (error) {
                    // update failed
                    console.log("Error: ");
                    console.log(error);
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
    }catch(error){
        console.log("error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

// populate config table with initial data
async function populate_initial_config(){
    try{
        return new Promise((resolve,reject)=>{
            // execute insert statement
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
                                // worked
                                resolve({
                                    'success': true,
                                    'data': rs
                                });
                            },
                            (obj,error)=>{
                                // failed
                                console.log("Error: ");
                                console.log(error);
                                reject({
                                    'success': false,
                                    'error': error
                                });
                            }
                        );
                    });
                    resolve(res);
                }catch(error){
                    console.log("error: ");
                    console.log(error);
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
    }catch(error){
        console.log("error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

async function get_config_item(item)
{
    try{
        // select sql statement
        const st = "SELECT " + item + " FROM config WHERE id=1";
        console.log("st = " + st);
        return new Promise((resolve,reject)=>{
            // execute statement
            db.exec([{sql: st, args:[]}],true,(err,res)=>{
                // check if error
                if(err){
                    console.log("Error: ");
                    console.log(err);
                    return reject({
                        success: false,
                        error: err
                    })
                }

                if(res[0].error){
                    console.log("error: ");
                    console.log(res[0].error);
                    return reject({
                        success: false,
                        error: res[0].error
                    })
                }
                console.log("res = ");
                console.log(res[0]["rows"][0][item]);

                // return item from config
                resolve({
                    success: true,
                    data: res[0]["rows"][0][item]
                });
            });
        });
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

// add data to trail checklist
async function add_trail_checklist_data(data) {
    try{
        console.log("add trail checklist called");
        return new Promise((resolve, reject) => {
            // execute insert sql statement
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
                                // worked
                                resolve({
                                    success: true
                                });
                            },
                            (txObj, error) => {
                                // failed
                                console.log("ErrorDB: " + error);
                                reject({ "success": false, "error": error });
                            }
                        );
                    });

                    resolve({ "success": true });
                } catch (error) {
                    console.log("error: ");
                    console.log(error);
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
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

// add data to trail table
async function add_trail_data(data) {
    try{
        console.log("add trail data");
        console.log("data: ");
        console.log(data);
        console.log("data.image_url = ");
        console.log(data.image_URL);
        console.log("data.audio_URL = ");
        console.log(data.audio_url);
        return new Promise((resolve, reject) => {
            // execute insert sql statement with bind values
            db.transaction(async tx => {
                try {
                    await new Promise((resolve, reject) => {
                        tx.executeSql(
                            'INSERT INTO trail(id,name,description,mileage,rating,is_wheelchair_accessible,image_URL,image_URL2,image_URL3,image_URL4,image_URL5,audio_URL) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
                            [
                                data.id,
                                data.name,
                                data.description,
                                data.mileage,
                                data.rating,
                                data.is_wheelchair_accessible,
                                data.image_URL,
                                data.image_URL2,
                                data.image_URL3,
                                data.image_URL4,
                                data.image_URL5,
                                data.audio_url
                            ],
                            (txObj, resultSet) => {
                                // insert worked
                                console.log("resultSet = ");
                                console.log(resultSet);
                                resolve({
                                    success: true
                                });
                            },
                            (txObj, error) => {
                                // insert failed
                                console.log("Error DB: " + error);
                                reject({ "success": false, "error": error });
                            }
                        );
                    });

                    resolve({ "success": true });
                } catch (error) {
                    console.log("Error DB: " + error);
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
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

// get all trail data
async function get_all_trails() {
    try{
        // select sql statement
        console.log("get all trails called");
        const st = "SELECT id,name FROM trail";
        console.log("st = " + st);
        return new Promise((resolve,reject)=>{
            // execute statement
            db.exec([{sql: st, args:[]}],true,(err,res)=>{
                // check if error
                if(err){
                    console.log("error: ");
                    console.log(err);
                    return reject({
                        success: false,
                        error: err
                    })
                }

                if(res[0].error){
                    console.log("error: ");
                    console.log(res[0].error);
                    return reject({
                        success: false,
                        error: res[0].error
                    })
                }
                console.log("res = ");
                console.log(res[0]['rows']);

                // return id,name from trails
                resolve({
                    success: true,
                    data: res[0]["rows"]
                });
            });
        });
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

// get trail information for trail with id
async function get_trail_by_id(trail_id) {
    try{
        console.log("get trail by id");
        // sql statement to get trail data
        const st = 'SELECT name, description, mileage, rating, is_wheelchair_accessible, image_URL, audio_URL FROM trail WHERE id=' + trail_id;
        return new Promise((resolve,reject)=>{
            // execute sql statement
            db.exec([{sql: st, args:[]}],true,(err,res)=>{
                // check if error
                if(err){
                    console.log("error: ");
                    console.log(err);
                    return reject({
                        success: false,
                        error: err
                    })
                }

                if(res[0].error){
                    console.log("error: ");
                    console.log(res[0].error);
                    return reject({
                        success: false,
                        error: res[0].error
                    })
                }
                console.log("res = ");
                console.log(res[0]['rows']);

                // return trail data
                resolve({
                    success: true,
                    data: res[0]["rows"]
                });
            });
        });
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

// get checklist for trail with id
async function get_checklist_for_trail(trail_id) {
    try{
        // sql statement to select item from trailchecklist that matches id
        console.log("get checklist for trail called");
        const st = 'SELECT item FROM trailchecklist WHERE trailId=' + trail_id;
        return new Promise((resolve,reject)=>{
            // execute statement
            db.exec([{sql: st, args:[]}],true,(err,res)=>{
                // check if error
                if(err){
                    console.log("error: ");
                    console.log(err);
                    return reject({
                        success: false,
                        error: err
                    })
                }

                if(res[0].error){
                    console.log("error: ");
                    console.log(res[0].error);
                    return reject({
                        success: false,
                        error: res[0].error
                    })
                }
                console.log("res = ");
                console.log(res[0]['rows']);

                // get items for trail id
                resolve({
                    success: true,
                    data: res[0]["rows"]
                });
            });
        });
    }catch(error){
        console.log("Error: ");
        console.log(error);
        return {
            'success': false,
            'error': error
        }
    }
}

export {
    add_trail_checklist_data,
    add_trail_data, get_all_trails, get_checklist_for_trail, get_config_item, get_trail_by_id,
    setup, setup_config, update_config
};

