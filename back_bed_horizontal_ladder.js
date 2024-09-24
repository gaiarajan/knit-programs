#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

// Parameters
const Width = 30;
const InitialHeight = 10;
const Height = 40;
const Carrier = "3";  // Main knitting carrier
const CastOnStitch = 61;  // "Half / Wrap" stitch for Polo
const KnittingStitch = 63;  // "Knitting" stitch for Polo
const DoBindOff = true;

const LadderCarrier = "4";  // Carrier for ladder section
const LadderWidth = 4;
const LadderHeight = 6;
const ladderMin = (Width + 1 - LadderWidth) / 2;
const ladderMax = ladderMin + LadderWidth;

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
            console.log("tuck - b" + n + " " + carrier);
        }
    }
    for (let n = min; n <= max; ++n) {
        if ((max - n) % 2 === 1) {
            console.log("tuck + b" + n + " " + carrier);
        }
    }
}

function knitFrontRow(min, max, carrier) {
    for (let n = min; n <= max; ++n) {
        console.log(`knit + b${n} ${carrier}`);
    }
    for (let n = max; n >= min; --n) {
        console.log(`knit - b${n} ${carrier}`);
    }
}

function knitFrontMissedRow(min, max, carrier) {
    for (let i = 0; i <= LadderHeight; i++) {
        knitFrontRow(Width / 2 - LadderWidth / 2, Width / 2 + LadderWidth / 2, carrier);
    }
}

function bindOffLadder(carrier) {
    let min = ladderMin;
    let max = ladderMax;
    console.log("inhook " + carrier);  // Inserting the ladder carrier
    console.log("x-stitch-number " + KnittingStitch);
    
    for (let n = min; n < max; ++n) {
        console.log("xfer b" + n + " f" + n);
        console.log("rack 1.0");
        console.log("xfer f" + n + " b" + (n + 1));
        console.log("rack 0.0");
    }

    // Drop stitches for ladder carrier
    console.log("outhook " + carrier);
    console.log("rack 0.25");
    for (let n = min; n <= max; ++n) {
        console.log("drop b" + n);
    }
}

function bindOff(shouldBindOff, height, carrier) {
    if (shouldBindOff) {
        let min = 1;
        let max = min + Width - 1;

        if ((height - 1) % 2 === 1) {
            console.warn("NOTE: adding an extra row so that bind-off can work to the right.");
            for (let n = max; n >= min; --n) {
                console.log("knit - b" + n + " " + carrier);
            }
        }
        for (let n = min; n < max; ++n) {
            console.log("xfer b" + n + " f" + n);
            console.log("rack 1.0");
            console.log("xfer f" + n + " b" + (n + 1));
            console.log("rack 0.25");
            if ((n - min) % 2 === 1) {
                console.log("tuck + f" + n + " " + carrier);
            }
            console.log("knit + b" + (n + 1) + " " + carrier);
            if (n + 2 <= max) {
                console.log("miss + b" + (n + 2) + " " + carrier);
            }
            console.log("rack 0.0");
        }
        console.log("knit - b" + max + " " + carrier);
        console.log("knit + b" + max + " " + carrier);
        dropStitches(max, carrier);
    }
}

// Main operation
let min = 1;
let max = min + Width - 1;
castOn(Carrier);

for(let i = 0; i < InitialHeight; i++)
{
    knitFrontRow(min, max, Carrier);
}

for (let i = 0; i < Height; i++) {
    if (i % LadderHeight == 0) {
        knitFrontMissedRow(ladderMin, ladderMax, LadderCarrier);
        bindOffLadder(LadderCarrier);  // Bind off ladder carrier after missed rows
    } else {
        knitFrontRow(min, max, Carrier);
    }
}

bindOff(DoBindOff, Height, Carrier);

console.log("outhook " + Carrier);

// Drop the loops
if (!DoBindOff) {
    for (let n = min; n <= max; ++n) {
        console.log("drop b" + n);
    }
} else {
    console.log("rack 0.25");
    for (let n = 1; n <= Width; ++n) {
        console.log("drop f" + n);
        console.log("drop b" + n);
    }
}
