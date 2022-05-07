class Element {
    static specificChar;

    constructor(amount, elementName) {
        this.amount = amount;
        this.elementName = elementName;
    }

    getAmount() {
        return this.amount;
    }

    getElementName() {
        return this.elementName;
    }

    getInfo() {

    }
}

class Iron extends Element {
    static elementName = "Iron";
    static specificChar = "Ore purity";

    constructor(amount, orePurity) {
        super(amount, Iron.elementName);
        this.orePurity = orePurity;
    }

    getInfo() {
        return Iron.specificChar + ": " + (this.orePurity * 100) + "%";
    }
}

class Carbon extends Element {
    static carbonLatticeTypes = ["diamond", "graphite", "lonsdaleite", "C60 buckminsterfullerene", "C540 fullerite", "C70 fullerene", "amorphous carbon", "zig-zag single-walled"];
    static elementName = "Carbon";
    static specificChar = "Lattice shape";

    constructor(amount, latticeShape) {
        super(amount, Carbon.elementName);
        this.latticeShape = Carbon.carbonLatticeTypes[latticeShape];
    }

    getInfo() {
        return Carbon.specificChar + ": " + this.latticeShape;
    }
}

var array = [];
for (let i = 0; i < 100; i++) {
    let randNum = Math.floor(Math.random() * 2);
    let randAmount = Math.floor(Math.random() * 100000);
    switch (randNum) {
        case 0:
            let randLattice = Math.floor(Math.random() * 8);
            array[i] = new Carbon(randAmount, randLattice);
        break;
        case 1:
            let randPurity = Math.random();
            array[i] = new Iron(randAmount, randPurity);
        break;
    }
}

array.forEach(element => {
    console.log(element.getElementName() + " - " + element.getInfo());
});
