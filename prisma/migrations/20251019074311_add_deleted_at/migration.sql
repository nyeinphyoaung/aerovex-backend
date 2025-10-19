-- AlterTable
ALTER TABLE "public"."permissions" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "public"."roles" ADD COLUMN     "deleted_at" TIMESTAMP(6);

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "deleted_at" TIMESTAMP(6),
ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;
