const SupplyChain = artifacts.require("SupplyChain");
const { expect } = require('chai');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

contract("SupplyChain", (accounts) => {
  const [owner, addr1, addr2, addr3, addr4] = accounts;

  let supplyChain;

  beforeEach(async () => {
    supplyChain = await SupplyChain.new({ from: owner });
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      const contractOwner = await supplyChain.Owner();
      expect(contractOwner).to.equal(owner);
    });
  });

  describe("Roles", () => {
    it("Should add raw material supplier by owner", async () => {
      await supplyChain.addRMS(addr1, "RMS1", "Place1", { from: owner });
      const rms = await supplyChain.RMS(1);
      expect(rms.addr).to.equal(addr1);
      expect(rms.name).to.equal("RMS1");
      expect(rms.place).to.equal("Place1");
    });

    it("Should add manufacturer by owner", async () => {
      await supplyChain.addManufacturer(addr2, "MAN1", "Place2", { from: owner });
      const man = await supplyChain.MAN(1);
      expect(man.addr).to.equal(addr2);
      expect(man.name).to.equal("MAN1");
      expect(man.place).to.equal("Place2");
    });

    it("Should add distributor by owner", async () => {
      await supplyChain.addDistributor(addr3, "DIS1", "Place3", { from: owner });
      const dis = await supplyChain.DIS(1);
      expect(dis.addr).to.equal(addr3);
      expect(dis.name).to.equal("DIS1");
      expect(dis.place).to.equal("Place3");
    });

    it("Should add retailer by owner", async () => {
      await supplyChain.addRetailer(addr4, "RET1", "Place4", { from: owner });
      const ret = await supplyChain.RET(1);
      expect(ret.addr).to.equal(addr4);
      expect(ret.name).to.equal("RET1");
      expect(ret.place).to.equal("Place4");
    });

    it("Should not add roles by non-owner", async () => {
      await expectRevert(
        supplyChain.addRMS(addr1, "RMS2", "Place1", { from: addr1 }),
        "onlyByOwner"
      );
      await expectRevert(
        supplyChain.addManufacturer(addr2, "MAN2", "Place2", { from: addr2 }),
        "onlyByOwner"
      );
      await expectRevert(
        supplyChain.addDistributor(addr3, "DIS2", "Place3", { from: addr3 }),
        "onlyByOwner"
      );
      await expectRevert(
        supplyChain.addRetailer(addr4, "RET2", "Place4", { from: addr4 }),
        "onlyByOwner"
      );
    });
  });

  describe("Medicine Lifecycle", () => {
    beforeEach(async () => {
      await supplyChain.addRMS(addr1, "RMS1", "Place1", { from: owner });
      await supplyChain.addManufacturer(addr2, "MAN1", "Place2", { from: owner });
      await supplyChain.addDistributor(addr3, "DIS1", "Place3", { from: owner });
      await supplyChain.addRetailer(addr4, "RET1", "Place4", { from: owner });
    });

    it("Should add a new medicine by owner", async () => {
      await supplyChain.addMedicine("Med1", "Description1", { from: owner });
      const medicine = await supplyChain.MedicineStock(1);
      expect(medicine.name).to.equal("Med1");
      expect(medicine.description).to.equal("Description1");
      expect(medicine.stage.toNumber()).to.equal(0); // STAGE.Init
    });

    it("Should update stage to RawMaterialSupply", async () => {
      await supplyChain.addMedicine("Med1", "Description1", { from: owner });
      await supplyChain.RMSsupply(1, { from: addr1 });
      const medicine = await supplyChain.MedicineStock(1);
      expect(medicine.stage.toNumber()).to.equal(1); // STAGE.RawMaterialSupply
      expect(medicine.RMSid.toNumber()).to.equal(1);
    });

    it("Should update stage to Manufacture", async () => {
      await supplyChain.addMedicine("Med1", "Description1", { from: owner });
      await supplyChain.RMSsupply(1, { from: addr1 });
      await supplyChain.Manufacturing(1, { from: addr2 });
      const medicine = await supplyChain.MedicineStock(1);
      expect(medicine.stage.toNumber()).to.equal(2); // STAGE.Manufacture
      expect(medicine.MANid.toNumber()).to.equal(1);
    });

    it("Should update stage to Distribution", async () => {
      await supplyChain.addMedicine("Med1", "Description1", { from: owner });
      await supplyChain.RMSsupply(1, { from: addr1 });
      await supplyChain.Manufacturing(1, { from: addr2 });
      await supplyChain.Distribute(1, { from: addr3 });
      const medicine = await supplyChain.MedicineStock(1);
      expect(medicine.stage.toNumber()).to.equal(3); // STAGE.Distribution
      expect(medicine.DISid.toNumber()).to.equal(1);
    });

    it("Should update stage to Retail", async () => {
      await supplyChain.addMedicine("Med1", "Description1", { from: owner });
      await supplyChain.RMSsupply(1, { from: addr1 });
      await supplyChain.Manufacturing(1, { from: addr2 });
      await supplyChain.Distribute(1, { from: addr3 });
      await supplyChain.Retail(1, { from: addr4 });
      const medicine = await supplyChain.MedicineStock(1);
      expect(medicine.stage.toNumber()).to.equal(4); // STAGE.Retail
      expect(medicine.RETid.toNumber()).to.equal(1);
    });

    it("Should update stage to Sold", async () => {
      await supplyChain.addMedicine("Med1", "Description1", { from: owner });
      await supplyChain.RMSsupply(1, { from: addr1 });
      await supplyChain.Manufacturing(1, { from: addr2 });
      await supplyChain.Distribute(1, { from: addr3 });
      await supplyChain.Retail(1, { from: addr4 });
      await supplyChain.sold(1, { from: addr4 });
      const medicine = await supplyChain.MedicineStock(1);
      expect(medicine.stage.toNumber()).to.equal(5); // STAGE.sold
    });

    it("Should not update stage by non-authorized roles", async () => {
      await supplyChain.addMedicine("Med1", "Description1", { from: owner });
      await expectRevert(supplyChain.RMSsupply(1, { from: addr2 }), ""); // Replace with specific revert message if any
      await supplyChain.RMSsupply(1, { from: addr1 });
      await expectRevert(supplyChain.Manufacturing(1, { from: addr3 }), ""); // Replace with specific revert message if any
      await supplyChain.Manufacturing(1, { from: addr2 });
      await expectRevert(supplyChain.Distribute(1, { from: addr4 }), ""); // Replace with specific revert message if any
      await supplyChain.Distribute(1, { from: addr3 });
      await expectRevert(supplyChain.Retail(1, { from: addr1 }), ""); // Replace with specific revert message if any
      await supplyChain.Retail(1, { from: addr4 });
      await expectRevert(supplyChain.sold(1, { from: addr3 }), ""); // Replace with specific revert message if any
    });
  });
});