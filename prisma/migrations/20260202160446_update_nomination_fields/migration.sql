/*
  Warnings:

  - You are about to drop the column `taskDetails` on the `Nomination` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Nomination` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Nomination" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teacherName" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "role" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "year" INTEGER NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Nomination_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Nomination" ("createdAt", "id", "schoolId", "teacherName", "year") SELECT "createdAt", "id", "schoolId", "teacherName", "year" FROM "Nomination";
DROP TABLE "Nomination";
ALTER TABLE "new_Nomination" RENAME TO "Nomination";
CREATE UNIQUE INDEX "Nomination_schoolId_teacherName_year_key" ON "Nomination"("schoolId", "teacherName", "year");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
