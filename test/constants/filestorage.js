import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { Platform } from 'react-native';

var permissions = null;

// download file from url
async function download_file_from_url(url)
{
  try{
    // split url by /
    const file_ar = url.split('/');
    // get filename
    const filename = file_ar[file_ar.length - 1];
    // download file
    const res = await FileSystem.downloadAsync(
      url,
      FileSystem.documentDirectory + filename
    ).catch((e)=>{
      console.log("Error: " + e);
      return {"success": false, "error": e};
    });
    // save file to device
    const temp = await save_file(res.uri, filename, res.headers['content-type']);
    return temp;
  }catch(err){
    console.log("Error: ");
    console.log(err);
    return {
      'success': false,
      'error': e
    }
  }
}

// save file locally to device
async function save_file(uri,filename,mimetype)
{
  // check if device is android
  if (Platform.OS === "android") {
    // check if permissions are set
    if(permissions === null)
    {
      // set permissions
      permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync().catch((e)=>{
        console.log("Error: " + e);
        return {"success": false, "error": e};
      });
    }
    // check if permissions are granted
    if (permissions.granted) {
      // base64 encode the file
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      // create file
      const e = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
        .then(async (uri) => {
          console.log("uri: ");
          console.log(uri);
          // write file data to device
          await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 }).catch((e)=>{
            console.log("Error2: "+ e);
            return {"success": false, "error": e};
          });
          return {"success": true, "uri": uri};
        })
        .catch((e) =>{
            console.log("Error: " + e);
            return {"success": false, "error": e};
        } );
        return e;
    // if permissions are not granted
    } else {
      //write file data to device
      await shareAsync(uri).catch((e)=>{
        console.log("Error3: " + e);
        return {"success": false, "error": e};
      });
      return {"success": true, "uri": uri};
    }
  } else {
    // write data to device in iOS
    await shareAsync(uri).catch((e)=>{
      console.log("Error3: " + e);
      return {"success": false, "error": e};
    });;
    return {"success": true, "uri": uri};
  }
}

export {
  download_file_from_url
};

