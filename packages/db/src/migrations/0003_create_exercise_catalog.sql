CREATE TABLE "athlete_disciplines" (
	"athlete_id" integer NOT NULL,
	"discipline_id" integer NOT NULL,
	CONSTRAINT "athlete_disciplines_athlete_id_discipline_id_pk" PRIMARY KEY("athlete_id","discipline_id")
);
--> statement-breakpoint
CREATE TABLE "disciplines" (
	"code" text NOT NULL,
	"description" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "disciplines_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "exercise_muscles" (
	"exercise_id" integer NOT NULL,
	"muscle_id" integer NOT NULL,
	"muscle_role_id" integer NOT NULL,
	"weight_percentage" real NOT NULL,
	CONSTRAINT "exercise_muscles_exercise_id_muscle_id_pk" PRIMARY KEY("exercise_id","muscle_id"),
	CONSTRAINT "exercise_muscles_weight_percentage_range_check" CHECK ("exercise_muscles"."weight_percentage" >= 0 AND "exercise_muscles"."weight_percentage" <= 100)
);
--> statement-breakpoint
CREATE TABLE "exercise_patterns" (
	"exercise_id" integer NOT NULL,
	"pattern_id" integer NOT NULL,
	CONSTRAINT "exercise_patterns_exercise_id_pattern_id_pk" PRIMARY KEY("exercise_id","pattern_id")
);
--> statement-breakpoint
CREATE TABLE "exercise_relationships" (
	"default_transfer_coefficient" real NOT NULL,
	"discipline_id" integer NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"source_exercise_id" integer NOT NULL,
	"target_exercise_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exercise_relationships_default_transfer_coefficient_range_check" CHECK ("exercise_relationships"."default_transfer_coefficient" >= 0 AND "exercise_relationships"."default_transfer_coefficient" <= 1)
);
--> statement-breakpoint
CREATE TABLE "exercise_roles" (
	"code" text NOT NULL,
	"description" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exercise_roles_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "exercises" (
	"archived_at" timestamp with time zone,
	"bodyweight_coefficient" real,
	"code" text NOT NULL,
	"description_markdown" text,
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text,
	"is_system" boolean DEFAULT false NOT NULL,
	"is_unilateral" boolean DEFAULT false NOT NULL,
	"loading_type_id" integer,
	"publication_status" text DEFAULT 'draft' NOT NULL,
	"short_instructions_markdown" text,
	"subtitle" text,
	"title" text NOT NULL,
	"video_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exercises_code_unique" UNIQUE("code"),
	CONSTRAINT "exercises_bodyweight_coefficient_range_check" CHECK ("exercises"."bodyweight_coefficient" IS NULL OR ("exercises"."bodyweight_coefficient" >= 0 AND "exercises"."bodyweight_coefficient" <= 1)),
	CONSTRAINT "exercises_publication_status_check" CHECK ("exercises"."publication_status" IN ('draft', 'published'))
);
--> statement-breakpoint
CREATE TABLE "loading_types" (
	"code" text NOT NULL,
	"description" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "loading_types_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "muscle_roles" (
	"code" text NOT NULL,
	"description" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "muscle_roles_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "muscles" (
	"chain" text,
	"code" text NOT NULL,
	"common_name" text,
	"description" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"parent_muscle_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "muscles_code_unique" UNIQUE("code"),
	CONSTRAINT "muscles_chain_check" CHECK ("muscles"."chain" IS NULL OR "muscles"."chain" IN ('anterior', 'posterior'))
);
--> statement-breakpoint
CREATE TABLE "patterns" (
	"code" text NOT NULL,
	"description" text NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "patterns_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "athlete_disciplines" ADD CONSTRAINT "athlete_disciplines_athlete_id_athletes_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athletes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_disciplines" ADD CONSTRAINT "athlete_disciplines_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_muscles" ADD CONSTRAINT "exercise_muscles_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_muscles" ADD CONSTRAINT "exercise_muscles_muscle_id_muscles_id_fk" FOREIGN KEY ("muscle_id") REFERENCES "public"."muscles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_muscles" ADD CONSTRAINT "exercise_muscles_muscle_role_id_muscle_roles_id_fk" FOREIGN KEY ("muscle_role_id") REFERENCES "public"."muscle_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_patterns" ADD CONSTRAINT "exercise_patterns_exercise_id_exercises_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_patterns" ADD CONSTRAINT "exercise_patterns_pattern_id_patterns_id_fk" FOREIGN KEY ("pattern_id") REFERENCES "public"."patterns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_relationships" ADD CONSTRAINT "exercise_relationships_discipline_id_disciplines_id_fk" FOREIGN KEY ("discipline_id") REFERENCES "public"."disciplines"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_relationships" ADD CONSTRAINT "exercise_relationships_role_id_exercise_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."exercise_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_relationships" ADD CONSTRAINT "exercise_relationships_source_exercise_id_exercises_id_fk" FOREIGN KEY ("source_exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercise_relationships" ADD CONSTRAINT "exercise_relationships_target_exercise_id_exercises_id_fk" FOREIGN KEY ("target_exercise_id") REFERENCES "public"."exercises"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_loading_type_id_loading_types_id_fk" FOREIGN KEY ("loading_type_id") REFERENCES "public"."loading_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "muscles" ADD CONSTRAINT "muscles_parent_muscle_id_fk" FOREIGN KEY ("parent_muscle_id") REFERENCES "public"."muscles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "athlete_disciplines_discipline_id_idx" ON "athlete_disciplines" USING btree ("discipline_id");--> statement-breakpoint
CREATE INDEX "exercise_muscles_muscle_id_muscle_role_id_idx" ON "exercise_muscles" USING btree ("muscle_id","muscle_role_id");--> statement-breakpoint
CREATE INDEX "exercise_patterns_pattern_id_idx" ON "exercise_patterns" USING btree ("pattern_id");--> statement-breakpoint
CREATE INDEX "exercise_relationships_discipline_source_idx" ON "exercise_relationships" USING btree ("discipline_id","source_exercise_id");--> statement-breakpoint
CREATE INDEX "exercise_relationships_target_role_transfer_idx" ON "exercise_relationships" USING btree ("discipline_id","target_exercise_id","role_id","default_transfer_coefficient");--> statement-breakpoint
CREATE INDEX "exercise_relationships_role_id_idx" ON "exercise_relationships" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "exercise_relationships_source_exercise_id_idx" ON "exercise_relationships" USING btree ("source_exercise_id");--> statement-breakpoint
CREATE INDEX "exercise_relationships_target_exercise_id_idx" ON "exercise_relationships" USING btree ("target_exercise_id");--> statement-breakpoint
CREATE UNIQUE INDEX "exercise_relationships_discipline_source_target_unique" ON "exercise_relationships" USING btree ("discipline_id","source_exercise_id","target_exercise_id");--> statement-breakpoint
CREATE INDEX "exercises_archived_at_idx" ON "exercises" USING btree ("archived_at");--> statement-breakpoint
CREATE INDEX "exercises_loading_type_id_idx" ON "exercises" USING btree ("loading_type_id");--> statement-breakpoint
CREATE INDEX "exercises_publication_status_idx" ON "exercises" USING btree ("publication_status");--> statement-breakpoint
CREATE INDEX "muscles_parent_muscle_id_idx" ON "muscles" USING btree ("parent_muscle_id");
