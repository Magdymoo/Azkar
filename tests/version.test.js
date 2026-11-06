const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const src=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const fn=/function newer\(a,b\)\{.*?\}   \/\* /s.exec(src)[0].replace(/   \/\* $/,'');
const newer=vm.runInNewContext('('+fn.replace('function newer','function')+')');
test('newer(): release beats rc, rc ordering, plain semver',()=>{
 for(const[a,b,exp]of[['2.0.0','2.0.0-rc.6',true],['2.0.0-rc.6','2.0.0',false],['2.0.0-rc.7','2.0.0-rc.6',true],['2.0.0-rc.5','2.0.0-rc.6',false],['2.0.1','2.0.0-rc.9',true],['2.0.0','2.0.0',false],['2.0.0-rc.6','2.0.0-rc.6',false],['2.0.0-rc.1','1.14.0',true],['1.14.0','2.0.0-rc.1',false],['1.14.1','1.14.0',true],['1.9.0','1.14.0',false]])assert.equal(newer(a,b),exp,a+' vs '+b)});
test('no legacy sun()/lt()/S.rem.*.sun reads outside migration; all app scripts versioned',()=>{
 assert.ok(!/function sun\(t,lat,lon\)/.test(src));assert.ok(!/[^a-zA-Z.]lt\(-?\d|[^a-zA-Z.]lt\(i/.test(src));
 assert.ok(!/r\.m\.sun|S\.rem\.m\.sun|S\.rem\.e\.sun/.test(src));
 for(const f of['data.js','day.js','home.js','times.js'])assert.ok(new RegExp('src="'+f+'\\?v=[^"]+"').test(src),f);
 const sw=fs.readFileSync(path.join(__dirname,'..','sw.js'),'utf8'),v=/const VER = '([^']+)'/.exec(sw)[1];assert.ok(sw.includes("'times.js?v="+v+"'"));assert.ok(src.includes('times.js?v='+v))});
