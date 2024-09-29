const { createClient } = require('redis');

// Create a Redis client
const client = createClient();

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

const Get_Data_From_Redis = async (local_client, Key) => {
  // Get the value from Redis
  const result = await local_client.get(Key);
  return result;
}

async function main() {
  // Connect to Redis
  Connect_To_Redis(client);

  // Set a value in Redis
  const result_of_addNew = Set_Data_To_Redis(client,'name2', 'Trung Tin');
  console.log('Status of request add new:', result_of_addNew);

  // Get the value from Redis
  const value = await Get_Data_From_Redis(client,'name2');
  console.log('Value:', value);

  // Disconnect from Redis
  Disconnect_To_Redis(client);
  
}

main().catch(console.error);