const globalConfig = require('./config/config');
const mongoHelper = require('./helpers/databasehelper')
const btSerialPort = require('bluetooth-serial-port');

const VALID_TYPES = "l";

var serialConn = new btSerialPort.BluetoothSerialPort();

console.log(globalConfig.app.name);

let databaseUrl = globalConfig.database.url + "/" + globalConfig.database.name;
let mongoConn = mongoHelper.connectToMongo(databaseUrl, true, true);

var compiledValue = "";
var readCount = 0;
var valueType = "";

function processMeasurement(){
  switch (valueType) {
    case "l":
      console.log('Final lux value: ' + compiledValue + " lx");
      mongoHelper.addSunExposureData(globalConfig.gardenId, compiledValue);
      break;
    default:
      console.error("Dropped packet: Missing value type.");
      break;
  }

  resetMeasurementValues();
}

function resetMeasurementValues(){
  compiledValue="";
  readCount=0;
  valueType = "";
}

serialConn.on('found', function(address, name) {
 
  // you might want to check the found address with the address of your
  // bluetooth enabled Arduino device here.
  //console.log("Name of device: " + name);
  if(name == "GARDENTRACKER"){
    serialConn.findSerialPortChannel(address, function(channel) {
      serialConn.connect(address, channel, function() {
            console.log('connected ' + address);

            serialConn.on('data', function(buffer) {
                readCount++;
                
                console.log('Inbound buffer: ' + buffer.toString());
                if(/^\d+$/.test(buffer.toString())){
                  compiledValue = compiledValue +  buffer.toString();
                }else{
                  let bufferArray = buffer.toString().split('');
                  
                  for(let index = 0; index < bufferArray.length; index++){
                    //console.log("Processing value of: " + bufferArray[index]);

                    if(bufferArray[index] === 'e'){
                      processMeasurement();
                    } else if(VALID_TYPES.includes(bufferArray[index])){
                      if(valueType != ""){
                        console.error("Dropped packet: Missing ending code.");
                        //processMeasurement();
                        resetMeasurementValues();
                      }

                      valueType = bufferArray[index];
                    } else if(parseInt(bufferArray[index]) || bufferArray[index] == 0){
                      //console.log("Adding " + bufferArray[index] + " to " + compiledValue);
                      compiledValue = compiledValue + bufferArray[index];
                    }
                  }
                }
              }
            );
            
            serialConn.on('closed', function() {
              console.log("Connection to device lost: " + address);
              serialConn.inquire();
            });
            
        }, function () {
            console.log('cannot connect');
        });
    });
  }
});
 
serialConn.inquire();

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
    serialConn.close();
  })
})

