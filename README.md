# netTool
仅支持 linux 的网络工具

## 使用方法
```nodejs
const netTool = require("./net_tools.js);
```
### currentIp
获取当前设备的 IP
```nodejs
console.log(netTool.currentIp()); //  192.168.1.12
```
### cidr
```nodejs
console.log(netTool.cidr());    ////  192.168.1.12/24
```

### getSubnetIpSet
```nodejs
console.log(netTool.getSubnetIpSet());  // [ "192.168.1.1", ... , "192.168.1.254" ]
```

### scanOnlineDevice
```nodejs
console.log(netTool.scanOnlineDevice()); // [ { "ip": "192.168.1.113" , "mac": "ac:d5:64:98:a2:dd"} ..... ]
```






