const { execSync } = require('child_process');
const { yellow } = require('colors');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const { output } = require('../utils/fun-nas-server/webpack.common');


async function dockerBuildAndPush(dockerfileUri, image, baseDir, functionName, serviceName) {
  if (!image) {
    console.log(yellow(`The mirror under '${serviceName}/${functionName}' is empty.`));
    return;
  }

  let dockerfile = path.join(baseDir, dockerfileUri || '');
  if (!await fs.exists(dockerfile)) {
    throw new Error(`File ${dockerfile} not found.`);
  }
  const stat = await fs.stat(dockerfile);
  if (stat.isDirectory()) {
    dockerfile = path.join(dockerfile, 'Dockerfile');
    if (!await fs.exists(dockerfile)) {
      throw new Error(`File ${dockerfile} not found.`);
    }
  }

  if (!await fs.exists(dockerfile)) {
    throw new Error(`File ${dockerfile} not found.`);
  }

  execSync(`docker build -t ${image} -f ${dockerfile} .`, {
    stdio: 'inherit'
  });
}

async function buildkitBuild(dockerfileUri, image, baseDir, functionName, serviceName) {
  if (!image) {
    console.log(yellow(`The mirror under '${serviceName}/${functionName}' is empty.`));
    return;
  }

  let dockerfile = path.join(baseDir, dockerfileUri || '');
  if (!await fs.exists(dockerfile)) {
    throw new Error(`File ${dockerfile} not found.`);
  }
  const stat = await fs.stat(dockerfile);
  if (stat.isDirectory()) {
    dockerfile = path.join(dockerfile, 'Dockerfile');
    if (!await fs.exists(dockerfile)) {
      throw new Error(`File ${dockerfile} not found.`);
    }
  }

  if (!await fs.exists(dockerfile)) {
    throw new Error(`File ${dockerfile} not found.`);
  }
  execSync(`buildctl build --no-cache \
            --frontend dockerfile.v0 \
            --local context=${path.dirname(dockerfile)} \
            --local dockerfile=${path.dirname(dockerfile)} \
            --output type=image,name=${image},push=true`, {
  stdio: 'inherit'
});
  
}

module.exports = {
  dockerBuildAndPush,
  buildkitBuild
};
