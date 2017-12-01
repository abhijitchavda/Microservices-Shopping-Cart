//var server_ip_pc="18.217.169.200";
var server_ip_pc="product-catalog-server-load-1546340057.us-east-2.elb.amazonaws.com";
var server_port_pc="3000";
//var server_ip_sc="13.56.155.199";
var server_ip_sc="ninja-sc-load-108525937.us-west-1.elb.amazonaws.com";
var server_port_sc="9000";
var payment_api_endpoint = "http://54.193.66.242:5000/payment";
var order_api_endpoint = "http://54.193.66.242:4000/order";

module.exports.payment_api_endpoint=payment_api_endpoint;
module.exports.order_api_endpoint=order_api_endpoint;
module.exports.server_ip_pc=server_ip_pc;
module.exports.server_port_pc=server_port_pc;
module.exports.server_ip_sc=server_ip_sc;
module.exports.server_port_sc=server_port_sc;



