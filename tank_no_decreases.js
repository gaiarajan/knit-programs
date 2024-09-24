// headers:
console.log(';!knitout-2');
console.log(';;Carriers: 1 2 3 4 5 6 7 8 9 10');

// global parameters:
const TubeWidth = 50; // width of the tank top tube
const Carrier1 = 3; // Carrier for the tube and left front strap
const Carrier2 = 4; // Carrier for the right front strap
const Carrier3 = 5; // Carrier for the left back strap
const Carrier4 = 6; // Carrier for the right back strap
const ArmholeHeight = 60; // height from the bottom to start shaping armholes
const ShoulderHeight = 30; // height of the shoulders after armhole shaping
const StrapWidth = 6; // width of strap
const StrapHeight = 7; // height of the strap after armhole shaping
// track edges of cloth:
let min = 1;
let max = TubeWidth;

// Cast-on and knit the tube:
console.log(`inhook ${Carrier1}`);

for (let s = 1; s <= TubeWidth; s += 2) {
    console.log(`tuck + f${s} ${Carrier1}`);
}
for (let s = TubeWidth; s >= 1; s -= 2) {
    console.log(`tuck - b${s} ${Carrier1}`);
}
for (let s = 1; s <= TubeWidth; s += 2) {
    console.log(`tuck + f${s} ${Carrier1}`);
}
for (let s = TubeWidth; s >= 1; s -= 2) {
    console.log(`tuck - b${s} ${Carrier1}`);
}


// Function to knit a row for both front and back beds (tube)
function knitTubeRow(min, max, carrier) {
    for (let n = min; n <= max; ++n) {
        console.log(`knit + f${n} ${carrier}`);
    }
    for (let n = max; n >= min; --n) {
        console.log(`knit - b${n} ${carrier}`);
    }
}

// Function to knit a row on only the front bed
function knitFrontRow(min, max, carrier) {
    for (let n = min; n <= max; ++n) {
        console.log(`knit + f${n} ${carrier}`);
    }
    for (let n = max; n >= min; --n) {
        console.log(`knit - f${n} ${carrier}`);
    }
}

// Function to knit a row on only the back bed
function knitBackRow(min, max, carrier) {
    for (let n = min; n <= max; ++n) {
        console.log(`knit + b${n} ${carrier}`);
    }
    for (let n = max; n >= min; --n) {
        console.log(`knit - b${n} ${carrier}`);
    }
}

function bindOff(min, max, carrier, front) {
    if (front) {
        for (let n = min; n <= max - 1; n++) {
            console.log(`xfer f${n} f${n+1}`);
            console.log(`knit + f${n+1} ${carrier}`);
        }
        // After all transfers, drop the final stitch to complete the bind-off:
        console.log(`drop f${max}`);
    } else {
        for (let n = min; n <= max - 1; n++) {
            console.log(`xfer b${n} b${n+1}`);
            console.log(`knit + b${n+1} ${carrier}`);
        }
        // After all transfers, drop the final stitch to complete the bind-off:
        console.log(`drop b${max}`);
    }
}


// Knit the tube for the body before armholes
for (let r = 0; r < ArmholeHeight; ++r) {
    knitTubeRow(min, max, Carrier1);
}

// Knit the front and back separately until shoulder shaping
for (let r = 0; r < ShoulderHeight; ++r) {
    // Knit the front bed using Carrier1
    knitFrontRow(min, max, Carrier1);
    // Knit the back bed using Carrier3
    knitBackRow(min, max, Carrier3);
}

bindOff(min+StrapWidth+1, max-StrapWidth-1, Carrier2, true);
bindOff(min+StrapWidth+1, max-StrapWidth-1, Carrier4, false);

// Knit the shoulder straps separately
for (let r = 0; r < StrapHeight; ++r) {
    // Left front strap using Carrier1
    knitFrontRow(min, min + StrapWidth, Carrier1);
    // Right front strap using Carrier2
    knitFrontRow(max - StrapWidth, max, Carrier2);

    // Left back strap using Carrier3
    knitBackRow(min, min + StrapWidth, Carrier3);
    // Right back strap using Carrier4
    knitBackRow(max - StrapWidth, max, Carrier4);
}

// Transfer stitches from the back bed to the front bed to join at the top (neck opening)
for (let n = min; n <= min + StrapWidth; ++n) {
    console.log(`xfer b${n} f${n}`);
}
for (let n = max - StrapWidth; n <= max; ++n) {
    console.log(`xfer b${n} f${n}`);
}

// Knit the neck by joining the front and back stitches
knitFrontRow(min, min + StrapWidth, Carrier1);
knitFrontRow(max - StrapWidth, max, Carrier2);

// Finish off
console.log(`outhook ${Carrier1}`);
console.log(`outhook ${Carrier2}`);
console.log(`outhook ${Carrier3}`);
console.log(`outhook ${Carrier4}`);

for (let n = min; n <= max; ++n) {
    console.log(`drop f${n}`);
    console.log(`drop b${n}`);
}
