const { createClient } = require('redis');

// Create a Redis client
const client = createClient(); // create in API usage, only example in this API

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

async function Connect_To_Redis(local_client){
  // Connect to Redis
  await local_client.connect();
}

async function Disconnect_To_Redis(local_client){
  // Disconnect from Redis
  await local_client.disconnect();
}

const Set_Data_To_Redis = async (local_client, Key, Value) => {
  // Set a value in Redis
  const result = await local_client.set(Key, Value);
  return result;
}

const Delete_Data_In_Redis = async (local_client) => {
  // Set a value in Redis
  // const result = await local_client.del(Key);
  var Cache_List = await local_client.keys('*');
  var Number_Of_Cache = Cache_List.length;
  // console.log(`Number of element in Cache: ${Number_Of_Cache[0]}`);
  for (let i = 0;i<Number_Of_Cache;i++){
    await local_client.del(Cache_List[i]);
  }
  // return result;
}

const Get_Data_From_Redis = async (local_client, Key) => {
  // Get the value from Redis
  const result = await local_client.get(Key);
  return result;
}


module.exports = {
  Connect_To_Redis,      // name client
  Disconnect_To_Redis,   // name client
  Set_Data_To_Redis,     // name client, key, value
  Get_Data_From_Redis,    // name client, key
  Delete_Data_In_Redis
};