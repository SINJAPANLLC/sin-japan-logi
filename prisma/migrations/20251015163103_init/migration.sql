/*
  Warnings:

  - You are about to drop the column `price` on the `offers` table. All the data in the column will be lost.
  - You are about to alter the column `budget` on the `shipments` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `cargoValue` on the `shipments` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `proposedPrice` to the `offers` table without a default value. This is not possible if the table is not empty.
  - Made the column `budget` on table `shipments` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shipmentId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "proposedPrice" REAL NOT NULL,
    "message" TEXT,
    "vehicleInfo" TEXT,
    "estimatedPickupTime" TEXT,
    "estimatedDeliveryTime" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "offers_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "offers_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_offers" ("carrierId", "createdAt", "id", "message", "shipmentId", "status", "updatedAt") SELECT "carrierId", "createdAt", "id", "message", "shipmentId", "status", "updatedAt" FROM "offers";
DROP TABLE "offers";
ALTER TABLE "new_offers" RENAME TO "offers";
CREATE INDEX "offers_shipmentId_idx" ON "offers"("shipmentId");
CREATE INDEX "offers_carrierId_idx" ON "offers"("carrierId");
CREATE INDEX "offers_status_idx" ON "offers"("status");
CREATE TABLE "new_shipments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shipperId" TEXT NOT NULL,
    "cargoName" TEXT NOT NULL,
    "cargoDescription" TEXT,
    "cargoWeight" REAL NOT NULL,
    "cargoVolume" REAL,
    "cargoValue" REAL,
    "pickupAddress" TEXT NOT NULL,
    "pickupCity" TEXT NOT NULL,
    "pickupPrefecture" TEXT NOT NULL,
    "pickupPostalCode" TEXT NOT NULL,
    "pickupDate" DATETIME NOT NULL,
    "pickupTimeFrom" TEXT,
    "pickupTimeTo" TEXT,
    "deliveryAddress" TEXT NOT NULL,
    "deliveryCity" TEXT NOT NULL,
    "deliveryPrefecture" TEXT NOT NULL,
    "deliveryPostalCode" TEXT NOT NULL,
    "deliveryDate" DATETIME NOT NULL,
    "deliveryTimeFrom" TEXT,
    "deliveryTimeTo" TEXT,
    "requiredVehicleType" TEXT NOT NULL,
    "needsHelper" BOOLEAN NOT NULL DEFAULT false,
    "needsLiftGate" BOOLEAN NOT NULL DEFAULT false,
    "temperature" TEXT,
    "specialInstructions" TEXT,
    "budget" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "carrierId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "shipments_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shipments_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_shipments" ("budget", "cargoDescription", "cargoName", "cargoValue", "cargoVolume", "cargoWeight", "carrierId", "createdAt", "deliveryAddress", "deliveryCity", "deliveryDate", "deliveryPostalCode", "deliveryPrefecture", "deliveryTimeFrom", "deliveryTimeTo", "id", "needsHelper", "needsLiftGate", "pickupAddress", "pickupCity", "pickupDate", "pickupPostalCode", "pickupPrefecture", "pickupTimeFrom", "pickupTimeTo", "requiredVehicleType", "shipperId", "specialInstructions", "status", "temperature", "updatedAt") SELECT "budget", "cargoDescription", "cargoName", "cargoValue", "cargoVolume", "cargoWeight", "carrierId", "createdAt", "deliveryAddress", "deliveryCity", "deliveryDate", "deliveryPostalCode", "deliveryPrefecture", "deliveryTimeFrom", "deliveryTimeTo", "id", "needsHelper", "needsLiftGate", "pickupAddress", "pickupCity", "pickupDate", "pickupPostalCode", "pickupPrefecture", "pickupTimeFrom", "pickupTimeTo", "requiredVehicleType", "shipperId", "specialInstructions", "status", "temperature", "updatedAt" FROM "shipments";
DROP TABLE "shipments";
ALTER TABLE "new_shipments" RENAME TO "shipments";
CREATE INDEX "shipments_status_idx" ON "shipments"("status");
CREATE INDEX "shipments_pickupPrefecture_idx" ON "shipments"("pickupPrefecture");
CREATE INDEX "shipments_deliveryPrefecture_idx" ON "shipments"("deliveryPrefecture");
CREATE INDEX "shipments_pickupDate_idx" ON "shipments"("pickupDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
