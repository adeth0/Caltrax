-- CreateTable
CREATE TABLE "meal_templates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meal_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meal_template_items" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "foodId" TEXT NOT NULL,
    "servingGrams" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "meal_template_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "meal_templates_userId_idx" ON "meal_templates"("userId");

-- CreateIndex
CREATE INDEX "meal_template_items_templateId_idx" ON "meal_template_items"("templateId");

-- AddForeignKey
ALTER TABLE "meal_templates" ADD CONSTRAINT "meal_templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_template_items" ADD CONSTRAINT "meal_template_items_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "meal_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meal_template_items" ADD CONSTRAINT "meal_template_items_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "foods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
