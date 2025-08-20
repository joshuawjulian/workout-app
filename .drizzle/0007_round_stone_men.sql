CREATE TABLE "equipment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment_to_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"equipment_id" uuid NOT NULL,
	"movement_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "movements_to_movement_patterns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"movement_id" uuid NOT NULL,
	"movement_pattern_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "movements" ALTER COLUMN "name" SET DATA TYPE varchar(256);--> statement-breakpoint
ALTER TABLE "movements" ADD COLUMN "youtube_url" varchar(512);--> statement-breakpoint
ALTER TABLE "movements" ADD COLUMN "parent_movement_id" uuid;--> statement-breakpoint
ALTER TABLE "equipment_to_movements" ADD CONSTRAINT "equipment_to_movements_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_to_movements" ADD CONSTRAINT "equipment_to_movements_movement_id_movements_id_fk" FOREIGN KEY ("movement_id") REFERENCES "public"."movements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movements_to_movement_patterns" ADD CONSTRAINT "movements_to_movement_patterns_movement_id_movements_id_fk" FOREIGN KEY ("movement_id") REFERENCES "public"."movements"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "movements_to_movement_patterns" ADD CONSTRAINT "movements_to_movement_patterns_movement_pattern_id_movement_patterns_id_fk" FOREIGN KEY ("movement_pattern_id") REFERENCES "public"."movement_patterns"("id") ON DELETE no action ON UPDATE no action;