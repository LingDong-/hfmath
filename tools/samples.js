const fs = require('fs');
const {hfmath} = require('../dist/hfmath');
let tests = fs.readFileSync(__dirname+'/tests.md').toString().split('$$').filter((x,i)=>i%2);

for (let i = 0; i < tests.length; i++){
  let latex = tests[i];

  let eq = new hfmath(latex);

  let svg = eq.svg({
    SCALE_X:24,
    SCALE_Y:24,
    STROKE_W:2,
    BG_COLOR:'white',
  });
  fs.writeFileSync(__dirname+`/../samples/${(i).toString().padStart(3,0)}.svg`,svg);
  
}