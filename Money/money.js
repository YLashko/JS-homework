class Money {

    constructor(amount, sign) {
        this.diff = 100;
        this.amount = Math.floor(amount * this.diff);
        this.sign = sign;
    }

    sum(other) { 
        // +
        this.#checkSign(other);
        return new Money(Math.floor(this.amount + other.amount) / this.diff, this.sign);
    }

    sumeq(other) { 
        // +=
        this.#checkSign(other);
        this.amount += other.amount;
    }

    sub(other) { 
        // -
        this.#checkSign(other);
        return new Money(Math.floor(this.amount - other.amount) / this.diff, this.sign);
    }

    subeq(other) { 
        // -=
        this.#checkSign(other);
        this.amount -= other.amount;
    }

    mul(other) { 
        // *
        if (typeof other == "number") {
            return new Money(Math.floor(this.amount * other) / this.diff, this.sign);
        }
        this.#checkSign(other);
        return new Money(Math.floor(this.amount * other.amount) / this.diff, this.sign);
    }

    muleq(other) { 
        // *=
        if (typeof other == "number") {
            this.amount = Math.floor(this.amount * other);
        }
        this.#checkSign(other);
        this.amount = Math.floor(this.amount * other.amount);
    }

    div(other) { 
        // /
        if (typeof other == "number") {
            return new Money(Math.floor(this.amount / other) / this.diff, this.sign);
        }
        this.#checkSign(other);
        return new Money(Math.floor(this.amount / other.amount) / this.diff, this.sign);
    }

    diveq(other) { 
        // /=
        if (typeof other == "number") {
            this.amount = Math.floor(this.amount / other);
        }
        this.#checkSign(other);
        this.amount = Math.floor(this.amount / other.amount);
    }

    toString() {
        return ((this.amount / this.diff) + this.sign);
    }

    eq(other) {
        // ==
        this.#checkSign(other);
        return this.amount == other.amount;
    }

    noteq(other) {
        // !=
        this.#checkSign(other);
        return this.amount != other.amount;
    }

    #checkSign(other) {
        if (this.sign != other.sign) {
            throw new Error("Currencies have different signs!");
        }
    };

    valueOf() {
        return this.amount / this.diff;
    }
}

var money1 = new Money(100.1, "$");
var money2 = new Money(50, "$");
var money3 = new Money(30, "euro");
var money4 = new Money(100.1, "$");
var num = 40;
console.log(money1.toString());
console.log(money1.noteq(money2));
console.log(money1.eq(money4));
console.log(money1.sum(money2).toString());
console.log(money1.mul(num).toString());
console.log(money2.sub(money3).toString());