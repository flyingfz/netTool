//@ts-check

const execa = require("execa");
const eol = require("os").EOL;

/**
 * 获取当前ip
 * @returns {string}
 */
function currentIp() {
    const ip = require("ip");
    let localIp = ip.address();
    return localIp;
}

/**
 * 获取 本设备 cidr 格式的 ip 地址
 * @returns {Promise<string>}
 */
async function cidr() {
    const current_ip = currentIp();
    // 获取包含 cidr 的IP 地址
    let { stdout} = await execa("ip" , ["addr"]);
    let line = stdout.split("\n").find(t=>{ return t.indexOf(current_ip) > -1 });
    let cidrIp = line.split(" ").find(t=> { return t.indexOf(current_ip) > -1 });
    return cidrIp;
}

/**
 * 获取当前设备所在子网的 ip 地址集合，不论设备是否在线
 * @returns {Promise<Array<string>>}
 */
async function getSubnetIpSet() {
    const cidrTools = require('cidr-tools');
    let cidr_ip = await cidr();
    let ipAry = cidrTools.expand(cidr_ip);
    return ipAry;
}

/**
 *  获取当前设备所在子网所有在线的设备 ip 地址及 mac 地址
 * @returns {Promise<Array<IpMac>>}
 */
async function scanOnlineDevice() {
    let ipAry = await getSubnetIpSet();
    let pmsAry = ipAry.map( ip => {
        return tryDevice(ip , "80");  //用 80。 端口其实无所谓。主要是 由此引发 了一次 arp 查询的动作
    });
    await Promise.all(pmsAry);
    let { stdout } = await execa("arp" , [ "-a"]);
    let allLine = stdout.split(eol);
    return allLine.filter(t => { return t.indexOf("incomplete") == -1}).map( line => {
        let tmpAry = line.split(" ");
        let obj = {
            "ip" : tmpAry[1].replace("(" , "").replace(")" , ""),
            "mac" : tmpAry[3]
        }
        return obj
    });
}

/**
 *
 * @param {string} ip
 * @param {string} port
 */
async function tryDevice(ip , port) {
    try {
      await execa('nc' , [ '-w' , "1" , ip , port ]);
    } catch (error) {
        //可以忽略错误
    }
}

module.exports = {
    scanOnlineDevice , getSubnetIpSet , cidr , currentIp
}

/**
 * ip mac 对应关系
 * @typedef {object} IpMac
 * @property {string} mac
 * @property {string} ip
 */