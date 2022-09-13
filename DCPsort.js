function generateInput(amount) {
  const array = [];
  for (let i = 0; i < amount; i += 1) {
    array.push(Math.floor(Math.random() * 1000));
  }
  return array;
}

function splitInput(arr, numChunks) {
  const chunks = [];
  for (let i = 0; i < numChunks; i += 1) chunks[i] = [];
  for (let i = 0; i < arr.length; i += 1) chunks[i % numChunks].push(arr[i]);
  return chunks;
}

function chunkSort(arr) {
  const sorted = [];
  while (arr.length) {
    let currentChunk = arr[0];
    let bestChunkIndex = 0;
    let bestValue = currentChunk[0];
    for (let i = 1; i < arr.length; i += 1) {
      currentChunk = arr[i];
      if (currentChunk[0] < bestValue) {
        [bestValue] = currentChunk;
        bestChunkIndex = i;
      }
    }
    sorted.push(arr[bestChunkIndex].shift());
    if (arr[bestChunkIndex.length] === 0) arr.splice(bestChunkIndex, 1);
  }
  return sorted;
}

async function main() {
  const compute = require("dcp/compute");

  /* INPUT DATA */
  const sourceSet = generateInput(TOTAL);
  console.log("Source Set: ", sourceSet);
  const inputSet = splitInput(sourceSet, CHUNKS);
  console.log("Chunks Set: ", inputSet);

  /* WORK FUNCTION */
  async function workFN(arr) {
    progress();
    return arr.sort(function (a, b) {
      return a - b;
    });
  }
  /* COMPUTE FOR */
  const job = compute.for(inputSet, workFN);
  job.public.name = "dcp-sort - Node";

  //SKIP IF: you don't need a compute group
  //job.computeGroups = [{ joinKey: 'Your Key', joinSecret: 'Your Secret' }];

  /* PROCESS RESULTS */
  let resultSet = job.exec();
  resultSet = Array.from(resultSet);
  console.log("Sorted Chunks: ", resultSet);
  const sortedSet = chunkSort(resultSet);
  console.log("Sorted Array: ", sortedSet);
}
require("dcp-client").init("https://scheduler.distributed.computer").then(main);
