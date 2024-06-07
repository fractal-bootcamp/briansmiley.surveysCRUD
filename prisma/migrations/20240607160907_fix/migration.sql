/*
  Warnings:

  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BookGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_AuthorId_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_RenterId_fkey";

-- DropForeignKey
ALTER TABLE "BookGenre" DROP CONSTRAINT "BookGenre_BookId_fkey";

-- DropForeignKey
ALTER TABLE "BookGenre" DROP CONSTRAINT "BookGenre_GenreId_fkey";

-- DropTable
DROP TABLE "Author";

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "BookGenre";

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "Member";
