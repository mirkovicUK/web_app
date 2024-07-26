import { open, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as path from 'path'
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourcePath = path.join(__dirname, './signUp/cognitoSignUpHandler.js')
const destinationPath = path.join(__dirname, '../__tests__/cognitoSignUpHandler.test.js')
const backupFolderPath = path.join(__dirname, '.injectCodeBackup');

(async () => {
    //read cognitoSignUpHandler into variable 
  const file = await open(sourcePath);
  const lines = []
  let flag = false
  for await (const line of file.readLines()) {
    if(line === '//function starts here'){
        flag = true
        continue
    }
    if(line === '//function ends here'){
        flag = false
    }
    if(flag){
        lines.push(line)
    }
  }
  file?.close()
  const codeToInject = lines.join('\n')

  //read everithing but function from test file into variable
  const testFile = await open(destinationPath)
  const linesTest = []
  for await (const line of testFile.readLines()) {
    if(line === '//copyAfterThisLine'){
        linesTest.push(line)
        break
    }
    linesTest.push(line) 
  }
  testFile?.close()

  const codeB4Injection = linesTest.join('\n')
  const newFileContent = codeB4Injection + '\n' + codeToInject
  //backup data 
  backup(backupFolderPath, newFileContent)

  // truncate test file
  let filehandle = null;
  try {
    filehandle = await open(destinationPath, 'r+');
    await filehandle.truncate();
  } finally {
    await filehandle?.close();
  }

  //write to test file
  writeFile(destinationPath, newFileContent)
  console.log(`Code successfully updated in test suit ${destinationPath}`)
})();

function backup (pathToFolder, backupData){
  //make directory if not exist
  try {
    if (!fs.existsSync(pathToFolder)) {
      fs.mkdirSync(pathToFolder);
    }
  } catch (err) {
    console.error(err);
  }
  const backupFileName =  new Date().toString().split(' ').join('_') + '.js'
  const backupFilePath = path.join(pathToFolder, backupFileName);
  writeFile(backupFilePath, backupData)  
}