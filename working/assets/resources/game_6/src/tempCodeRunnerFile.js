var str = "12312";
var reg = RegExp(/12/);
if(reg.exec(str)){
    // 包含        
    console.log(reg.exec(str)); // true
}