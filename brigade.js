const { events, Job, Group } = require("brigadier");

events.on("push", function(e, project) {
  console.log("received push for commit " + e.commit)

  // Create a new job
  var node = new Job("test-runner")

  // We want our job to run the stock Docker Python 3 image
  node.image = "python:3"

  // Now we want it to run these commands in order:
  node.tasks = [
    "cd /src/",
    "pip install -r requirements.txt",
  ]

  // We're done configuring, so we run the job
  node.run().then(()=>{
    events.emit("buidling", e, project)
  })

})

events.on("buidling", (e, project) => {
    console.log("fired 'next' event")

    var build = new Job("build-runner")

    build.image= "python:3"

    build.task = [
        "ls"
    ]

    build.run()
  })