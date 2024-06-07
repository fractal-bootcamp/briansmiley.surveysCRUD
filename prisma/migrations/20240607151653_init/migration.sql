-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "Question" TEXT NOT NULL,
    "Content" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reponse" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Reponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "AuthorId" TEXT NOT NULL,
    "ISBN" TEXT NOT NULL,
    "RenterId" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Biography" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Address" TEXT,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookGenre" (
    "id" TEXT NOT NULL,
    "BookId" TEXT NOT NULL,
    "GenreId" TEXT NOT NULL,

    CONSTRAINT "BookGenre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_ISBN_key" ON "Book"("ISBN");

-- CreateIndex
CREATE UNIQUE INDEX "Author_Name_key" ON "Author"("Name");

-- CreateIndex
CREATE UNIQUE INDEX "Member_Email_key" ON "Member"("Email");

-- AddForeignKey
ALTER TABLE "Reponse" ADD CONSTRAINT "Reponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_RenterId_fkey" FOREIGN KEY ("RenterId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_BookId_fkey" FOREIGN KEY ("BookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_GenreId_fkey" FOREIGN KEY ("GenreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
