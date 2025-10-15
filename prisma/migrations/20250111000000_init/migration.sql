-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "postalCode" TEXT,
    "address" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "shipments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shipperId" TEXT NOT NULL,
    "cargoName" TEXT NOT NULL,
    "cargoDescription" TEXT,
    "cargoWeight" REAL NOT NULL,
    "cargoVolume" REAL,
    "cargoValue" INTEGER,
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
    "budget" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "carrierId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "shipments_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "shipments_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "offers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shipmentId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "offers_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "shipments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "offers_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "shipments_shipperId_idx" ON "shipments"("shipperId");

-- CreateIndex
CREATE INDEX "shipments_carrierId_idx" ON "shipments"("carrierId");

-- CreateIndex
CREATE INDEX "shipments_status_idx" ON "shipments"("status");

-- CreateIndex
CREATE INDEX "offers_shipmentId_idx" ON "offers"("shipmentId");

-- CreateIndex
CREATE INDEX "offers_carrierId_idx" ON "offers"("carrierId");

-- CreateIndex
CREATE INDEX "offers_status_idx" ON "offers"("status");

