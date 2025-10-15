-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carrierId" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "vehicleNumber" TEXT NOT NULL,
    "driverName" TEXT NOT NULL,
    "driverPhone" TEXT NOT NULL,
    "maxWeight" REAL NOT NULL,
    "maxVolume" REAL,
    "length" REAL,
    "width" REAL,
    "height" REAL,
    "hasLiftGate" BOOLEAN NOT NULL DEFAULT false,
    "hasRefrigeration" BOOLEAN NOT NULL DEFAULT false,
    "hasTemperatureControl" BOOLEAN NOT NULL DEFAULT false,
    "canLoadUnload" BOOLEAN NOT NULL DEFAULT true,
    "availablePrefectures" TEXT NOT NULL,
    "availableFrom" DATETIME NOT NULL,
    "availableTo" DATETIME NOT NULL,
    "basePrice" REAL,
    "minPrice" REAL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "vehicles_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "vehicles_carrierId_idx" ON "vehicles"("carrierId");

-- CreateIndex
CREATE INDEX "vehicles_vehicleType_idx" ON "vehicles"("vehicleType");

-- CreateIndex
CREATE INDEX "vehicles_status_idx" ON "vehicles"("status");

-- CreateIndex
CREATE INDEX "vehicles_availableFrom_idx" ON "vehicles"("availableFrom");

-- CreateIndex
CREATE INDEX "vehicles_availableTo_idx" ON "vehicles"("availableTo");
