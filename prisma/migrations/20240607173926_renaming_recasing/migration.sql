/*
  Warnings:

  - You are about to drop the column `Content` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `Question` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `content` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "Content",
DROP COLUMN "Question",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "question" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "Name",
ADD COLUMN     "name" TEXT NOT NULL;
