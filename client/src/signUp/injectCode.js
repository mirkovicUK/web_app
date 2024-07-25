import { open } from 'fs/promises'

(async () => {
    //read cognitoSignUpHandler into variable 
  const file = await open('./123.js');

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
  const codeToInject = lines.join('\n')

  //read everithing but function from test file into variable
  const testFile = await open('../../__tests__/123.test.js')
  
  const linesTest = []
  for await (const line of testFile.readLines()) {
    if(line === '//copyAfterThisLine'){
        linesTest.push(line)
        break
    }
    linesTest.push(line) 
  }
  const codeB4Injection = linesTest.join('\n')
  const newFileContent = codeB4Injection + '\n' + codeToInject
  console.log(newFileContent)
})();