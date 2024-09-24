#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

// Parameters
const Width = 30;  // Width of the rectangle
const Height = 40;  // Height of the rectangle
const Carrier = "3";  // Carrier for knitting
const LatticeWidth = 10;  // Width of each diamond lattice
const LatticeHeight = 10;  // Height of each diamond lattice
const CastOnStitch = 61;  // Cast-on stitch type
const KnittingStitch = 63;  // Knitting stitch type
const DoBindOff = true;  // Option to bind off at the end
const InitialHeight = 10;

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

// Function to calculate which stitches are part of the diamond outlines for a given row
function calculateDiamondRow(row) {
    let stitches = [];
    
    // Calculate for each diamond in the row
    for (let start = 1; start < Width; start += LatticeWidth) {
        let middle = start + Math.floor(LatticeWidth / 2);
        
        // Calculate sloping lines based on the current row in the diamond's height
        let relativeRow = row % LatticeHeight;
        let relativePosition = relativeRow - Math.floor(LatticeHeight / 2);
        if (relativeRow <= 1)
        {
            let left = middle - relativeRow;
            let right = middle + relativeRow;
            stitches.push(min);
            stitches.push(max);
            // Ensure that stitches stay within bounds
            if (left >= 1 && right <= Width) {
                stitches.push(left);
                stitches.push(left+1);
                stitches.push(right - 1);
                stitches.push(right);
            }
        }
        else if (relativePosition < 0) {
            // Upper part of the diamond: expanding outward
            let left = middle - relativeRow;
            let right = middle + relativeRow;
            stitches.push(min);
            stitches.push(max);
            // Ensure that stitches stay within bounds
            if (left >= 1 && right <= Width) {
                stitches.push(left);
                stitches.push(right);
            }
            
        } 
        else if(relativePosition == 0)
        {
            let left = middle - relativeRow;
            let right = middle + relativeRow;
            stitches.push(min);
            stitches.push(max);
            // Ensure that stitches stay within bounds
            if (left >= 1 && right <= Width) {
                stitches.push(left);
                stitches.push(left+1);
                stitches.push(right - 1);
                stitches.push(right);
            }
        }
        else if (relativeRow >= LatticeHeight - 1)
        {
           let relativeBottomRow = LatticeHeight - relativeRow - 1;
            let left = middle - relativeBottomRow;
            let right = middle + relativeBottomRow;
            stitches.push(min);
            stitches.push(max);
            // Ensure that stitches stay within bounds
            if (left >= 1 && right <= Width) {
                stitches.push(left);
                stitches.push(left+1);
                stitches.push(right - 1);
                stitches.push(right);
            } 
        }
        else {
            // Lower part of the diamond: contracting inward
            let relativeBottomRow = LatticeHeight - relativeRow - 1;
            let left = middle - relativeBottomRow;
            let right = middle + relativeBottomRow;
            stitches.push(min);
            stitches.push(max);
            // Ensure that stitches stay within bounds
            if (left >= 1 && right <= Width) {
                stitches.push(left);
                stitches.push(right);
            }
        }
    }

    return stitches;
}

// Function to knit a row based on the calculated diamond outline stitches
function knitDiamondRow(row, carrier) {
    let stitches = calculateDiamondRow(row);
    
    let min = Math.min(...stitches);
    let max = Math.max(...stitches);

    // Knit the row, only knitting the stitches that are part of the diamond outlines
    for (let n = min; n <= max; ++n) {
        if (stitches.includes(n)) {
            console.log(`knit + f${n} ${carrier}`);
        }
    }
    for (let n = max; n >= min; --n) {
        if (stitches.includes(n)) {
            console.log(`knit - f${n} ${carrier}`);
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

for(let i = 0; i < InitialHeight; i++)
{
    knitFrontRow(min, max, Carrier);
}
// Knit the diamond pattern
for (let row = 0; row < Height; ++row) {
    knitDiamondRow(row, Carrier);
}

// Bind off at the end
bindOff(DoBindOff, Carrier);
console.log("outhook " + Carrier);
