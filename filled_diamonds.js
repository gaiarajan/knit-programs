#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

// Parameters
const Width = 30; // Width of the rectangle
const Height = 40; // Height of the rectangle
const Carrier = "3"; // Carrier for knitting
const LatticeWidth = 6; // Width of each diamond lattice
const LatticeHeight = 6; // Height of each diamond lattice
const CastOnStitch = 61; // Cast-on stitch type
const KnittingStitch = 63; // Knitting stitch type
const DoBindOff = true;

console.log(";!knitout-2");
console.log(";;Carriers: 1 2 3 4 5 6 7 8 9 10");
console.log("x-presser-mode auto");

// Functions
function castOn(carrier) {
    console.log("inhook " + carrier);
    console.log("x-stitch-number " + CastOnStitch);

    let min = 1;
    let max = min + Width - 1;

    for (let n = max; n >= min; --n) {
        if ((max - n) % 2 === 0) {
            console.log("tuck - f" + n + " " + carrier);
        }
    }
    for (let n = min; n <= max; ++n) {
        if ((max - n) % 2 === 1) {
            console.log("tuck + f" + n + " " + carrier);
        }
    }
}

function knitFrontRow(min, max, carrier) {
    for (let n = min; n <= max; ++n) {
        console.log(`knit + f${n} ${carrier}`);
    }
    for (let n = max; n >= min; --n) {
        console.log(`knit - f${n} ${carrier}`);
    }
}

// Diamond lattice formation
function transferDiamond(min, max, carrier) {
    let center = Math.floor((min + max) / 2);

    for (let row = 0; row < LatticeHeight; ++row) {
        let left = center - row;
        let right = center + row;

        if (left >= min && right <= max) {
            console.log(`xfer f${left} b${left}`);
            console.log(`xfer f${right} b${right}`);
        }
        knitFrontRow(min, max, carrier);
    }

    for (let row = LatticeHeight - 1; row >= 0; --row) {
        let left = center - row;
        let right = center + row;

        if (left >= min && right <= max) {
            console.log(`xfer b${left} f${left}`);
            console.log(`xfer b${right} f${right}`);
        }
        knitFrontRow(min, max, carrier);
    }
}

function bindOff(shouldBindOff, carrier) {
    if (shouldBindOff) {
        let min = 1;
        let max = min + Width - 1;

        console.log("inhook " + carrier);
        console.log("x-stitch-number " + KnittingStitch);

        for (let n = min; n < max; ++n) {
            console.log("xfer f" + n + " b" + n);
            console.log("rack 1.0");
            console.log("xfer b" + n + " f" + (n + 1));
            console.log("rack 0.0");
            console.log("knit + f" + (n + 1) + " " + carrier);
        }

        console.log("knit - f" + max + " " + carrier);
        console.log("knit + f" + max + " " + carrier);
        
        // Drop stitches after bind-off
        dropStitches(max, carrier);
    }
}

function dropStitches(max, carrier) {
    console.log("rack 0.25");
    for (let n = 1; n <= max; ++n) {
        console.log("drop b" + n + " " + carrier);
        console.log("drop f" + n + " " + carrier);
    }
}

// Main operation
let min = 1;
let max = min + Width - 1;

// Cast on
castOn(Carrier);

// Create diamond lattice pattern over the height of the rectangle
for (let i = 0; i < Height; i += LatticeHeight) {
    transferDiamond(min, max, Carrier);
}

// Bind off at the end
bindOff(DoBindOff, Carrier);
console.log("outhook " + Carrier);
