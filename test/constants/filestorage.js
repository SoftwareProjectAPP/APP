import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { Platform } from 'react-native';

var permissions = null;

async function download_file_from_url(url)
{
  const file_ar = url.split('/');
  const filename = file_ar[file_ar.length - 1];
  const res = await FileSystem.downloadAsync(
    url,
    FileSystem.documentDirectory + filename
  ).catch((e)=>{
    console.log("Error2314: " + e);
    return {"success": false, "error": e};
  });
  const temp = await save_file(res.uri, filename, res.headers['content-type']);
  return temp;
}

async function save_file(uri,filename,mimetype)
{
    if (Platform.OS === "android") {
      if(permissions === null)
      {
        permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync().catch((e)=>{
          console.log("Error: " + e);
          return {"success": false, "error": e};
        });
      }
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const e = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (uri) => {
            console.log("uri: ");
            console.log(uri);
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
      } else {
        await shareAsync(uri).catch((e)=>{
          console.log("Error3: " + e);
          return {"success": false, "error": e};
        });
        return {"success": true, "uri": uri};
      }
      } else {
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

