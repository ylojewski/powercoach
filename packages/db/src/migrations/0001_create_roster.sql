CREATE TABLE "athletes" (
	"coach_id" integer NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"last_name" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "athletes_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "coach_organizations" (
	"coach_id" integer NOT NULL,
	"organization_id" integer NOT NULL,
	CONSTRAINT "coach_organizations_coach_id_organization_id_pk" PRIMARY KEY("coach_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE "coaches" (
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"last_name" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "coaches_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_organizations" ADD CONSTRAINT "coach_organizations_coach_id_coaches_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coaches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_organizations" ADD CONSTRAINT "coach_organizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;