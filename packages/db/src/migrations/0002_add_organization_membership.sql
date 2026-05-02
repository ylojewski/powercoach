ALTER TABLE "athletes" ADD COLUMN "organization_id" integer;--> statement-breakpoint
UPDATE "athletes"
SET "organization_id" = (
	SELECT "coach_organizations"."organization_id"
	FROM "coach_organizations"
	WHERE "coach_organizations"."coach_id" = "athletes"."coach_id"
	ORDER BY "coach_organizations"."organization_id"
	LIMIT 1
);--> statement-breakpoint
ALTER TABLE "athletes" ALTER COLUMN "organization_id" SET NOT NULL;--> statement-breakpoint
CREATE TABLE "coach_settings" (
	"coach_id" integer NOT NULL,
	"default_organization_id" integer NOT NULL,
	CONSTRAINT "coach_settings_coach_id_pk" PRIMARY KEY("coach_id")
);
--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_coach_organization_fk" FOREIGN KEY ("coach_id","organization_id") REFERENCES "public"."coach_organizations"("coach_id","organization_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_settings" ADD CONSTRAINT "coach_settings_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_settings" ADD CONSTRAINT "coach_settings_default_organization_fk" FOREIGN KEY ("coach_id","default_organization_id") REFERENCES "public"."coach_organizations"("coach_id","organization_id") ON DELETE no action ON UPDATE no action;
