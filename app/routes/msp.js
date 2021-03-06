var events = require('events');
var serial2 = require('./serial2');

var IDLE =                     0,
    HEADER_START =             1,
    HEADER_M =                 2,
    HEADER_ARROW =             3,
    HEADER_SIZE =              4,
    HEADER_CMD =               5,
    HEADER_ERR =               6,

    MISSION_FLAG_END =      0xA5;

var mission_step = {
    wp_number:  undefined,
    action:     undefined,
    lat:        undefined,
    lon:        undefined,
    altitude:   undefined,   
    p1:         undefined,
    p2:         undefined,
    p3:         undefined,
    flag:               0,
    wp_updated: undefined
};    

var MSP = {

    state:                   IDLE, 
    code:                       0,
    message_length_expected:    0,
    message_length_received:    0,
    message_buffer:             undefined,
    message_buffer_uint8_view:  undefined,
    message_checksum:           0,
    packet_error:               0,      

    codes: {
    MSP_IDENT:              100,
    MSP_STATUS:             101,
    MSP_RAW_IMU:            102,
    MSP_SERVO:              103,
    MSP_MOTOR:              104,
    MSP_RC:                 105,
    MSP_RAW_GPS:            106,
    MSP_COMP_GPS:           107,
    MSP_ATTITUDE:           108,
    MSP_ALTITUDE:           109,
    MSP_ANALOG:             110,
    MSP_RC_TUNING:          111,
    MSP_PID:                112,
    MSP_BOX:                113,
    MSP_MISC:               114,
    MSP_MOTOR_PINS:         115,
    MSP_BOXNAMES:           116,
    MSP_PIDNAMES:           117,
    MSP_WP:                 118,
    MSP_BOXIDS:             119,
    MSP_SERVO_CONF:         120,

    MSP_SET_RAW_RC:         200,
    MSP_SET_RAW_GPS:        201,
    MSP_SET_PID:            202,
    MSP_SET_BOX:            203,
    MSP_SET_RC_TUNING:      204,
    MSP_ACC_CALIBRATION:    205,
    MSP_MAG_CALIBRATION:    206,
    MSP_SET_MISC:           207,
    MSP_RESET_CONF:         208,
    MSP_SET_WP:             209,
    MSP_SELECT_SETTING:     210,
    MSP_SET_HEAD:           211,
    MSP_SET_SERVO_CONF:     212,
    MSP_SET_MOTOR:          214,

    // MSP_BIND:               240,

    MSP_EEPROM_WRITE:       250,

    MSP_DEBUGMSG:           253,
    MSP_DEBUG:              254,

    }
};

MSP.newFrame = new events.EventEmitter();

MSP.getStep = function(){
    return mission_step;
}

MSP.read = function(d) {
    var data = new Uint8Array(d);

        
    for (var i = 0; i < data.length; i++) {
        switch (this.state) {
            case IDLE: // sync char 1
                if (data[i] == 36) { // $
                    this.state = HEADER_START;
                }
                break;
            case HEADER_START: // sync char 2
                if (data[i] == 77) { // M
                    this.state = HEADER_M;
                } else { // restart and try again
                    this.state = IDLE;
                }
                break;

            case HEADER_M: // direction (should be >)
                if (data[i] == 62) { // >
                    this.state = HEADER_ARROW;
                } else if(data[i] == 33){
                    this.state = HEADER_ERR;
                }
                else{ // unknown
                    this.state = IDLE;
                }
                break;

            case HEADER_ARROW:            
                this.message_length_expected = data[i];

                this.message_checksum = data[i];

                // setup arraybuffer
                this.message_buffer = new ArrayBuffer(this.message_length_expected);
                this.message_buffer_uint8_view = new Uint8Array(this.message_buffer);

                this.state = HEADER_SIZE;
                break;

            case HEADER_SIZE:
                this.code = data[i];
                this.message_checksum ^= data[i];

                if (this.message_length_expected != 0) { // standard message
                    this.state = HEADER_CMD;
                } else { // MSP_ACC_CALIBRATION, etc...
                    this.state = HEADER_ERR;
                }
                break;

            case HEADER_CMD: // payload
                this.message_buffer_uint8_view[this.message_length_received] = data[i];
                this.message_checksum ^= data[i];
                this.message_length_received++;

                if (this.message_length_received >= this.message_length_expected) {
                    this.state = HEADER_ERR;
                }
                break;

            case HEADER_ERR:
                if (this.message_checksum == data[i]) {
                    // message received, process
                    this.process_data(this.code, this.message_buffer, this.message_length_expected);
                } else {
                    console.log('code: ' + this.code + ' - crc failed');

                    this.packet_error++;
                }
                

                // Reset variables
                this.message_length_received = 0;
                this.state = IDLE;
                break;
        }
    }
};

MSP.process_data = function(code, message_buffer, message_length) {
    try {
      var data = new DataView(message_buffer); // DataView (allowing us to view arrayBuffer as struct/union)
    } catch (ex) {
      console.log(ex);
      return;
    }

    var emitArray = []; // array for data to be emitted
    
    var pidP = [],
        pidD = [],
        pidI = [];

    PID_names = []; // empty the array as new data is coming in

    // process codes which return data, codes with no data just emit code
    switch (code) {
        case this.codes.MSP_IDENT:

            emitArray[0] = parseFloat((data.getUint8(0) / 100).toFixed(2)); // version
            emitArray[1] = data.getUint8(1); // multitype
            emitArray[2] = data.getUint8(2); // msp_version
            emitArray[3] = data.getUint32(3, 1); // capability
            break;

        case this.codes.MSP_STATUS:
            
            emitArray[0] = data.getUint16(0, 1); // cycle time
            emitArray[1] = data.getUint16(2, 1); // i2c error count
            emitArray[2] = data.getUint16(4, 1); // sensor
            emitArray[3] = data.getUint32(6, 1); // flag           
            break;

        case this.codes.MSP_RAW_IMU:  

            //Acelerometro
            emitArray[0]  = data.getInt16(0, 1);
            emitArray[1]  = data.getInt16(2, 1);
            emitArray[2]  = data.getInt16(4, 1);           
            //Giroscopio
            emitArray[3]  = parseInt(data.getInt16(6, 1) * 0.244140625);
            emitArray[4]  = parseInt(data.getInt16(8, 1) * 0.244140625);
            emitArray[5]  = parseInt(data.getInt16(10,1) * 0.244140625);            
            //Magenetometro
            emitArray[6]  = parseInt(data.getInt16(12, 1) / 3);
            emitArray[7]  = parseInt(data.getInt16(14, 1) / 3);
            emitArray[8]  = parseInt(data.getInt16(16, 1) / 3);             
            break;
        
        case this.codes.MSP_MOTOR:

            var needle = 0;
            for (var i = 0; i < 8; i++) {
                emitArray[i] = data.getUint16(needle, 1);
                needle += 2;
            }           
            break;

        case this.codes.MSP_RC: 

            emitArray[0] = data.getUint16(0, 1);         
            emitArray[1] = data.getUint16(2, 1); 
            emitArray[2] = data.getUint16(4, 1); 
            emitArray[3] = data.getUint16(6, 1); 
            emitArray[4] = data.getUint16(8, 1);  
            emitArray[5] = data.getUint16(10, 1);
            break;

        case this.codes.MSP_RAW_GPS:
            
            var lat = String(data.getInt32(2, 1));
            var lon = String(data.getInt32(6, 1));
            var latR = Number(lat.slice(0,-7)+'.'+lat.slice(-7));
            var lonR = Number(lon.slice(0,-7)+'.'+lon.slice(-7));
	    
            emitArray[0] = data.getUint8(0); // fix
            emitArray[1] = data.getUint8(1); // num sat
            emitArray[2] = latR//lat
            emitArray[3] = lonR//lon
            emitArray[4] = data.getUint16(10, 1); // alt
            emitArray[5] = data.getUint16(12, 1); // speed
            emitArray[6] = data.getUint16(14, 1); // ground course
                        
            break;
      
        case this.codes.MSP_ATTITUDE: 

            emitArray[0] = data.getInt16(0,1) / 10.0; // x/roll
            emitArray[1] = data.getInt16(2,1) / 10.0; // y/pitch
            emitArray[2] = data.getInt16(4,1); // heading
            break;

        case this.codes.MSP_ALTITUDE:
            emitArray[0] = parseFloat((data.getInt32(0) / 100.0).toFixed(2)); // correct scale factor // altitude
            emitArray[1] = parseFloat((data.getInt16(4) / 100.0).toFixed(2)); // correct scale factor // vario cm/s
            break;

        case this.codes.MSP_ANALOG:
            ANALOG.voltage = data.getUint8(0) / 10.0;
            ANALOG.mAhdrawn = data.getUint16(1, 1);
            ANALOG.rssi = data.getUint16(3, 1); // 0-1023
            ANALOG.amperage = data.getUint16(5, 1) / 100; // A
            break;
       
        case this.codes.MSP_PID:


             // ptr = 0;
             //        for (int i = 0; i < iPidItems; i++)
             //        {
             //            mw_gui.pidP[i] = (byte)inBuf[ptr++];
             //            mw_gui.pidI[i] = (byte)inBuf[ptr++];
             //            mw_gui.pidD[i] = (byte)inBuf[ptr++];
             //        }
             //        response_counter++;
             //        bOptions_needs_refresh = true;
             //        break;


            // PID data arrived, we need to scale it and save to appropriate bank / array
            needle = 0;
            for (var i = 0; i < (message_length / 3); i++) {
                // main for loop selecting the pid section
                switch (i) {
                    case 0:
                        pidP[i] = data.getUint8(needle++)/10;
                        pidI[i] = data.getUint8(needle++)/1000;
                        pidD[i] = data.getUint8(needle++);                        
                        break;
                    case 1:
                        pidP[i] = data.getUint8(needle++)/10;
                        pidI[i] = data.getUint8(needle++)/1000;
                        pidD[i] = data.getUint8(needle++);                        
                        break;
                    case 2:
                        pidP[i] = data.getUint8(needle++)/10;
                        pidI[i] = data.getUint8(needle++)/1000;
                        pidD[i] = data.getUint8(needle++);                        
                        break;
                    case 3:
                        pidP[i] = data.getUint8(needle++)/10;
                        pidI[i] = data.getUint8(needle++)/1000;
                        pidD[i] = data.getUint8(needle++);                        
                        break;
                    case 4:
                        pidP[i] = data.getUint8(needle++)/10;
                        pidI[i] = data.getUint8(needle++)/1000;
                        pidD[i] = data.getUint8(needle++);
                        
                        break;
                    case 5:
                        pidP[i] = data.getUint8(needle++)/10;
                        pidI[i] = data.getUint8(needle++)/1000;
                        pidD[i] = data.getUint8(needle++);
                        
                        break;
                    case 6:
                        pidP[i] = data.getUint8(needle++)/10;
                        pidI[i] = data.getUint8(needle++)/1000;
                        pidD[i] = data.getUint8(needle++);
                        
                        break;
                    case 7:
                        pidP[i] = data.getUint8(needle++)/10;
                        pidI[i] = data.getUint8(needle++)/1000;
                        pidD[i] = data.getUint8(needle++);
                        
                        break;
                    case 8:
                        pidP[i] = data.getUint8(needle++)/10;
                        pidI[i] = data.getUint8(needle++)/1000;
                        pidD[i] = data.getUint8(needle++);
                        
                        break;
                    case 9:
                        pidP[i] = data.getUint8(needle++)/10;
                        pidI[i] = data.getUint8(needle++)/1000;
                        pidD[i] = data.getUint8(needle++);
                        
                }
            }

            emitArray[0] = pidP;
            emitArray[1] = pidI;
            emitArray[2] = pidD;
            
            break;

        case this.codes.MSP_BOX:
            AUX_CONFIG_values = []; // empty the array as new data is coming in

            // fill in current data
            for (var i = 0; i < data.byteLength; i += 2) { // + 2 because uint16_t = 2 bytes
                AUX_CONFIG_values.push(data.getUint16(i, 1));
            }
            break;    
      
        case this.codes.MSP_BOXNAMES:
            AUX_CONFIG = []; // empty the array as new data is coming in

            var buff = [];
            for (var i = 0; i < data.byteLength; i++) {
                if (data.getUint8(i) == 0x3B) { // ; (delimeter char)
                    AUX_CONFIG.push(String.fromCharCode.apply(null, buff)); // convert bytes into ASCII and save as strings

                    // empty buffer
                    buff = [];
                } else {
                    buff.push(data.getUint8(i));
                }
            }

            console.log('AUX_CONFIG '+ AUX_CONFIG);
            console.log('buff ' + buff);
            break;
        case this.codes.MSP_PIDNAMES:

            var buff = [];
            for (var i = 0; i < data.byteLength; i++) {
                if (data.getUint8(i) == 0x3B) { // ; (delimeter char)
                    PID_names.push(String.fromCharCode.apply(null, buff)); // convert bytes into ASCII and save as strings

                    // empty buffer
                    buff = [];
                } else {
                    buff.push(data.getUint8(i));
                }
            }

            //console.log(PID_names);

            break;

        case this.codes.MSP_WP:

            waipoints = [];
            var ptr = 0;
            var wp_no = data.getUint8(ptr++);

            console.log('teste');

                        
            if (wp_no == 0)
            {
                // ptr++;  //Action is ignored
                // mw_gui.GPS_home_lat = BitConverter.ToInt32(inBuf, ptr); ptr += 4;
                // mw_gui.GPS_home_lon = BitConverter.ToInt32(inBuf, ptr); ptr += 4;
                // mw_gui.GPS_home_alt = BitConverter.ToInt32(inBuf, ptr); ptr += 4;
                // bHomeRecorded = true;
                //flag comes here but not care
            }
            if (wp_no == 255)
            {
                // ptr++; //action is ignored
                // mw_gui.GPS_poshold_lat = BitConverter.ToInt32(inBuf, ptr); ptr += 4;
                // mw_gui.GPS_poshold_lon = BitConverter.ToInt32(inBuf, ptr); ptr += 4;
                // mw_gui.GPS_poshold_alt = BitConverter.ToInt32(inBuf, ptr); ptr += 4;
                // bPosholdRecorded = true;

            }
            if ((wp_no > 0) && (wp_no < 255))     //It is a valid WP response
            {
                mission_step.wp_number = wp_no;
                mission_step.action = data.getInt8(ptr++);
                mission_step.lat = data.getInt32(ptr, 1); ptr += 4;
                mission_step.lon = data.getInt32(ptr, 1); ptr += 4;
                mission_step.altitude = data.getInt32(ptr, 1); ptr += 4;
                mission_step.p1 = data.getUint16(ptr, 1); ptr += 2;
                mission_step.p2 = data.getUint16(ptr, 1); ptr += 2;
                mission_step.p3 = data.getUint16(ptr, 1); ptr += 2;
                mission_step.flag = data.getInt8(ptr++);
            }            
            waipoints.push(mission_step);

            console.log(waipoints);        

            break;
        case this.codes.MSP_BOXIDS:
            AUX_CONFIG_IDS = []; // empty the array as new data is coming in

            for (var i = 0; i < data.byteLength; i++) {
                AUX_CONFIG_IDS.push(data.getUint8(i));
            }
            break;
        
        case this.codes.MSP_DEBUGMSG:
            break;
        case this.codes.MSP_DEBUG:

            emitArray[0] = data.getInt16(0,1);
            emitArray[1] = data.getInt16(2,1);
            emitArray[2] = data.getInt16(4,1); 
            emitArray[3] = data.getInt16(6,1); 
            break;

        default:
            console.log('Unknown code detected: ' + code);
    }

    // set codeName
    var codeName = 'UNKNOWN';
    for (key in this.codes) {
      if (this.codes[key] == code) {
        // this code is known
        codeName = key;
      }
    }

    this.newFrame.emit('new', {code:code,codeName:codeName,data:emitArray});  
    //console.log(emitArray)

};

MSP.msg = function(code, data) {
    var bufferOut;
    var bufView;

        // always reserve 6 bytes for protocol overhead !
    if (data) {    
                   
        var checksum = 0;
        
        bufferOut = new ArrayBuffer((data.length*2)+6);
        bufView = new Uint8Array(bufferOut);


        bufView[0] = 36; // $
        bufView[1] = 77; // M
        bufView[2] = 60; // <
        bufView[3] = data.length*2; // data length
        bufView[4] = code; // code


        checksum = bufView[3] ^ bufView[4]; // checksum
        
        for (var i = 0; i < data.length; i++) {
            bufView[(i*2)+5] = data[i] & 0xff;
            bufView[(i*2)+6] = data[i] >> 8;
            checksum ^= bufView[(i*2)+5];
            checksum ^= bufView[(i*2)+6];
        }

        bufView[5+(data.length*2)] = checksum; // checksum

    }else if(code != 118) {                

        bufferOut = new ArrayBuffer(6);
        bufView = new Uint8Array(bufferOut);

        bufView[0] = 36; // $
        bufView[1] = 77; // M
        bufView[2] = 60; // <
        bufView[3] = 0; // data length
        bufView[4] = code; // code
        bufView[5] = bufView[3] ^ bufView[4]; // checksum

    }
    
    //console.log('bufView ' + bufView);
    return bufView;
}

module.exports = MSP;
