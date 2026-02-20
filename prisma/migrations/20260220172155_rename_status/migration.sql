-- AlterEnum
BEGIN;
CREATE TYPE "ProjectStatus_new" AS ENUM ('IDEA', 'RESEARCH', 'STARTED', 'ACTIVE_DEV', 'DONE');
ALTER TABLE "public"."Project" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Project"
ALTER COLUMN "status" TYPE "ProjectStatus_new"
USING (
  CASE "status"::text
    WHEN 'DRAFT' THEN 'IDEA'
    WHEN 'IN_PROGRESS' THEN 'STARTED'
    WHEN 'POC_DONE' THEN 'ACTIVE_DEV'
    WHEN 'MVP_DONE' THEN 'DONE'
    WHEN 'ARCHIVED' THEN 'DONE'
    ELSE 'IDEA'
  END::"ProjectStatus_new"
);
ALTER TYPE "ProjectStatus" RENAME TO "ProjectStatus_old";
ALTER TYPE "ProjectStatus_new" RENAME TO "ProjectStatus";
DROP TYPE "public"."ProjectStatus_old";
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'IDEA';
COMMIT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'IDEA';
