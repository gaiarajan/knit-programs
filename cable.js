#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

// Parameters:

const Width = 42; // Total width of the knitting
const Height = 15; // Height of the knitting
const Carrier = "3";
const cableWidth = 3; // Width of each cable section
const cableSpacing = 2;
// Operation:

console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");

// Cast on stitches
console.log("inhook " + Carrier);

console.log("x-stitch-number 61"); // Alternating tucks cast-on

let min = 1;
let max = min + Width - 1;
let right = true;
function castOn()
{
    for (let n = min; n <= max; ++n) {
        if ((max-n)%2 == 1) {
            console.log("tuck + f" + n + " " + Carrier);
        }
    }
     for (let n = max; n >= min; --n) {
        if ((max-n) % 2 == 0) {
            console.log("tuck - f" + n + " " + Carrier);
        }
    }
}

function knitRow(min, max) {
    if (right)
    {
        for (let n = min; n <= max; ++n) {
            console.log("knit + f" + n + " " + Carrier);
        }
        right = false;
    }
    else
    {
       for (let n = max; n >= min; --n) {
           console.log("knit - f" + n + " " + Carrier);
       } 
       right = true;
    }
}

function cableStitch(min, max, cableStart) {
    let cableEnd = cableStart + cableWidth-1;
    if (cableEnd + cableWidth > max)
    {
        return;
    }
    for (let n = cableStart; n <= cableEnd+cableWidth; ++n) {
        console.log(`xfer f${n} b${n}`);
    }
    
    console.log(`rack ${cableWidth}`)
    
    for (let n = cableStart; n <= cableEnd; ++n) {
        console.log(`xfer b${n} f${n+cableWidth}`);
    }
    
    console.log(`rack -${cableWidth}`)
    
    for (let n = cableStart; n <= cableEnd; ++n) {
        console.log(`xfer b${n+cableWidth} f${n}`);
    }
    console.log(`rack 0`)
}

function cableRow(min, max)
{
    for (let n = min; n <= max; n++) {
        cableStitch(min, max, n);
        n += cableSpacing+cableWidth; // Skip the width of the cable
    }
    right = false;
}

castOn();

for (let r = 0; r < Height; ++r) {
    for(let i = 0; i < 2; i++)
    {
        knitRow(min, max);
    }
    cableRow(min, max);
    for(let i = 0; i < 2; i++)
    {
        knitRow(min, max);
    }
}

console.log("outhook " + Carrier);
