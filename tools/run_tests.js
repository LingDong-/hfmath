const {performance} = require('perf_hooks');
const fs = require('fs');
const {hfmath,_impl} = require('../dist/hfmath');
const {tokenize,parse,environments,plan,flatten,render} = _impl;


let teststrs = fs.readFileSync(__dirname+'/tests.md').toString().split('$$').filter((x,i)=>i%2);


function drawPlan(expr){
  let s = 24;
  let o = `<svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${expr.bbox.w*s}" height="${expr.bbox.h*s}"
    viewBox="${expr.bbox.x*s} ${expr.bbox.y*s} ${expr.bbox.w*s} ${expr.bbox.h*s}"
  ><rect x="${expr.bbox.x*s}" y="${expr.bbox.y*s}" width="${expr.bbox.w*s}" height="${expr.bbox.h*s}" fill="white"></rect>`;
  function draw(expr){
    if (!expr.bbox){
      return "";
    }
    let o  = `<g 
      transform="translate(${expr.bbox.x*s},${expr.bbox.y*s})"
    >`;
    o += `<rect 
      x="0" y="0" width="${expr.bbox.w*s}" height="${expr.bbox.h*s}"
      stroke="black" stroke-width="1" fill-opacity="0.1"
    />`;
    if (expr.type == 'symb' || expr.type == 'char'){
      o += `<text x="0" y="12">${expr.text.replace(/&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;')}</text>`;
    }
    for (let i = 0; i < expr.chld.length; i++){
      o += draw(expr.chld[i]);
    }
    o += `</g>`;
    return o;
  }
  o += draw(expr);
  o += `</svg>`;
  return o;
}

function drawPolylines(polylines,w,h,s){
  let o = `<svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="${w*s+s*2}" height="${h*s+s*2}"
    viewBox="${-s} ${-s} ${w*s+s*2} ${h*s+s*2}"
  >
  <rect x="${-s}" y="${-s}" width="${w*s+s*2}" height="${h*s+s*2}" fill="white"></rect>`;
  for (let i = 0; i < polylines.length; i++){
    o += `<path d="M `
    for (let j = 0; j < polylines[i].length; j++){
      o += (polylines[i][j][0]*s)+" "+(polylines[i][j][1]*s)+" ";
    }
    o += `" fill="none" stroke="black"/>`
  }
  o += `</svg>`
  return o;
}

function textSteps(){

let t0  = performance.now();

// for (let k = 0; k < 1000; k++){

let i = 25;
// for (i = 0; i < teststrs.length; i++)

{
console.log(i);
let tokens = tokenize(teststrs[i]);

// console.log(tokens);

let tree = parse(tokens);

// console.dir(tree,{depth:null});

environments(tree.chld);



plan(tree);



fs.writeFileSync(__dirname+`/test_results/test_${i}_a.svg`,drawPlan( tree ));

flatten(tree);


fs.writeFileSync(__dirname+`/test_results/test_${i}_b.svg`,drawPlan( tree ));

let polylines = render(tree);
// console.log(polylines);
let o = drawPolylines(polylines,tree.bbox.w,tree.bbox.h,16);
fs.writeFileSync(__dirname+`/test_results/test_${i}_c.svg`,o);

}


// }

console.log(performance.now()-t0);

}


function testWrapper(){

for (i = 0; i < teststrs.length; i++){

let eq = new hfmath(teststrs[i]);
let pdf = eq.pdf({SCALE_X:8,SCALE_Y:8,MARGIN_X:8,MARGIN_Y:8,STROKE_W:0.5});
fs.writeFileSync(__dirname+`/test_results/test_${i}_pdf.pdf`,pdf);

let svg = eq.svg({SCALE_X:8,SCALE_Y:8,MARGIN_X:8,MARGIN_Y:8,STROKE_W:0.5});
fs.writeFileSync(__dirname+`/test_results/test_${i}_svg.svg`,svg);

}

}

textSteps();
// testWrapper();