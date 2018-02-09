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
    var driver = project.secrets.DOCKER_DRIVER || "overlay"

    const docker = new Job("dind", "docker:stable-dind")

    docker.env.DOCKER_USER = project.secrets.DOCKER_USER
    docker.env.DOCKER_PASS = project.secrets.DOCKER_PASS

    docker.privileged = true;
    docker.env = {
      DOCKER_DRIVER: driver
    }
    docker.tasks = [
      "dockerd-entrypoint.sh &",
      "sleep 20",
      "cd /src",
      "docker build -t xvier/uuid:latest .",
      "docker login -u $DOCKER_USER -p $DOCKER_PASS registry.hub.docker.com",
      "docker push xvier/uuid:latest"
    ];
    
    docker.run()
  })