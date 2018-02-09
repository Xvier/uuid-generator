const { events, Job, Group } = require("brigadier");

events.on("push", function(e, project) {
  console.log("received push for commit " + e.commit)

  // Create a new job
  var node = new Job("test-runner")

  // We want our job to run the stock Docker Python 3 image
  node.image = "python:3"

  // Now we want it to run these commands in order:
  node.tasks = [
    "ls",
    "cd /src/",
    "pip install -r requirements.txt",
    "python setup.py test"
  ]

  // We're done configuring, so we run the job
   node.run().then(()=>{
    events.emit("build", e, project)
   })

 
})

events.on("build", () => {
    console.log("fired 'next' event")

    var build = new Job("build-runner")

    build.image = "python:3"
  
    build.task = [
        "echo Hello"
    ]
  
    build.run()

  })