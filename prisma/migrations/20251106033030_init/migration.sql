-- CreateTable
CREATE TABLE "UserLoginData" (
    "id" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "BirthDate" TIMESTAMP(3) NOT NULL,
    "Gender" TEXT NOT NULL,
    "PhoneNumber" TEXT NOT NULL,

    CONSTRAINT "UserLoginData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserMedicine" (
    "id" TEXT NOT NULL,
    "id2" SERIAL NOT NULL,
    "BrandName" TEXT NOT NULL,
    "ScientificName" TEXT,
    "PurchaseDate" TIMESTAMP(3),
    "ExpirationDate" TIMESTAMP(3),
    "PurchasePrice" INTEGER,
    "SellingPrice" INTEGER,
    "Quantity" INTEGER,
    "Location" TEXT,
    "Tags" TEXT,
    "Group" TEXT NOT NULL DEFAULT 'Default',

    CONSTRAINT "UserMedicine_pkey" PRIMARY KEY ("id")
);
