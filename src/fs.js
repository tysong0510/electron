export default {
  test() {
    let electronFs = require('electron').remote.require('fs');

    let filepath = "/home/danil/Desktop/question-mate";// you need to save the filepath when you open the file to update without use the file chooser dialog again
    
    electronFs.readFile(filepath, 'utf-8', (err, data) => {
      if (err) {
        alert("An error occurred reading the file :" + err.message);
        return;
      }

      alert("The file content is : " + data);
    });
  }
}
