import * as SQLite from 'expo-sqlite';

// TODO: test get_trail_by_id and get_checklist_for_trail. May need to rewrite to work with callback instead

const db = SQLite.openDatabase('db.testDb');

function setup(){
    db.transaction(tx =>{
        tx.executeSql('CREATE TABLE IF NOT EXISTS trail(id INTEGER PRIMARY KEY, name TEXT, description TEXT, mileage REAL, rating INTEGER, is_wheelchair_accessible INTEGER, image_URL TEXT, audio_URL TEXT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS trailchecklist(id INTEGER PRIMARY KEY, item TEXT, trailId INTEGER)');
    },(e)=>{
        console.log("Error dB: " + e);
    },()=>{
        console.log("tables createed");
        db.transaction(tx=>{
            tx.executeSql('DELETE FROM trail');
            tx.executeSql('DELETE FROM trailchecklist');
        },(e)=>{
            console.log("error db2: " + e);
        },()=>{
            console.log("tables emptied");
        });
    });
}

function add_trail_checklist_data(data,callback){
    db.transaction(tx=>{
        tx.executeSql('INSERT INTO trailchecklist(item,trailId) VALUES(?,?)',
        [
            data.item,
            data.trailId
        ],
        (txObj, resultSet)=>{
            //return {"success": true};
        },
        (txObj,error)=>{
            //return {"success": false, "error": error};
            console.log("ErrorDB: " + error);
        })
    },(e)=>{
        callback({"success": false, "error": e})
    },
    ()=>{
        callback({'success': true});
    });
}

function add_trail_data(data,callback){
    db.transaction(tx=>{
        tx.executeSql('INSERT INTO trail(id,name,description,mileage,rating,is_wheelchair_accessible,image_URL,audio_URL) VALUES(?,?,?,?,?,?,?,?)',
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
        (txObj, resultSet)=>{
            console.log("resultSet = ");
            console.log(resultSet);
            //callback({"success": true});
        },
        (txObj,error)=>{
            console.log("Error DB: " + error);
            //return {"success": false, "error": error};
        });
    },(e)=>{
        console.log("ERror: " + e);
        //return {"success": false, "error": e};
        callback({"success": false,"error": e});
    },
    ()=>{
        console.log("work");
        callback({"success": true});
    });
}

function get_all_trails(callback){
    db.transaction(tx=>{
        tx.executeSql('SELECT id,name FROM trail',null,
            (txObj,resultSet)=>{
                callback({
                    success: true,
                    data: resultSet["rows"]["_array"]
                });
            },
            (txObj,error)=>{
                callback({
                    success: false,
                    error_message: error
                });
            }
        )
    });
}

async function get_trail_by_id(trail_id){
    return await db.transaction(tx.executeSql('SELECT name, description, mileage, rating, is_wheelchair_accessible, image_URL, audio_URL FROM trail WHERE id=?',[trail_id],
    (txObj,resultSet)=>{
        return {
            success: true,
            data: resultSet
        };
    },(txObj,error)=>{
        return {
            success: false,
            error_message: error
        };
    }));
}

async function get_checklist_for_trail(trail_id)
{
    return await db.transaction(tx.executeSql('SELECT item FROM trailchecklist WHERE trailId=?',[trail_id],
    (txObj,resultSet)=>{
        return {
            error: false,
            data: resultSet
        };
    },(txObj,error)=>{
        return {
            error: true,
            error_message: error
        };
    }));
}

export {
    add_trail_checklist_data,
    add_trail_data, get_all_trails, get_checklist_for_trail, get_trail_by_id,
    setup
};

