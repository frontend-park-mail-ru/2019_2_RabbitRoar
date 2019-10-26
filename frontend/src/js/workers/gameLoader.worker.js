onmessage = function(event) {
    console.log("Worker: Message received from main script!");
    let result = event.data[0] * event.data[1];
    if (isNaN(result)) {
      postMessage("Please write two numbers!");
    } else {
      let workerResult = "Result: " + result;
      console.log("Worker: Posting message back to main script");
      postMessage(workerResult);
    }
  }