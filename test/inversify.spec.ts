import { injectable, inject, Container } from "inversify";
import "reflect-metadata";

interface Warrior {
  fight(): string;
  sneak(): string;
}

interface Weapon {
  hit(): string;
}

interface ThrowableWeapon {
  throw(): string;
}

const TYPES = {
  Warrior: Symbol.for("Warrior"),
  Weapon: Symbol.for("Weapon"),
  ThrowableWeapon: Symbol.for("ThrowableWeapon")
};

describe("inversify", () => {
  @injectable()
  class Katana implements Weapon {
    public hit() {
      return "cut";
    }
  }

  @injectable()
  class Shuriken implements ThrowableWeapon {
    public throw() {
      return "hit";
    }
  }

  @injectable()
  class Ninja implements Warrior {
    private _katana: Weapon;
    private _shuriken: ThrowableWeapon;

    public constructor(
      @inject(TYPES.Weapon) katana: Weapon,
      @inject(TYPES.ThrowableWeapon) shuriken: ThrowableWeapon
    ) {
      this._katana = katana;
      this._shuriken = shuriken;
    }
    public fight() {
      return this._katana.hit();
    }
    public sneak() {
      return this._shuriken.throw();
    }
  }

  const myContainer = new Container();
  myContainer.bind<Warrior>(TYPES.Warrior).to(Ninja);
  myContainer.bind<Weapon>(TYPES.Weapon).to(Katana);
  myContainer.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);

  describe("Container", () => {
    it("resolves dependencies", () => {
      const ninja = myContainer.get<Warrior>(TYPES.Warrior);
      expect(ninja.fight()).toBe("cut");
      expect(ninja.sneak()).toBe("hit");

      const ninja2 = new Ninja(new Katana(), new Shuriken());

      expect(ninja.fight()).toBe(ninja2.fight());
      expect(ninja.sneak()).toBe(ninja2.sneak());

      expect(ninja).not.toBe(ninja2);
      expect(ninja).toStrictEqual(ninja2);
    });
  });
});
