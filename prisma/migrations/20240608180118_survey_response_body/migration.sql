/*
  Warnings:

  - Added the required column `responseContent` to the `SurveyResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SurveyResponse" ADD COLUMN     "responseContent" TEXT NOT NULL;
