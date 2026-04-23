declare const DEMO_PASSWORD: "powercoach-demo";
declare const COACH_EMAIL: "astra.quill@example.test";
declare const COACH: {
    readonly email: "astra.quill@example.test";
    readonly firstName: "Astra";
    readonly lastName: "Quill";
};
declare const COACH_ROW: {
    readonly password: "powercoach-demo";
    readonly email: "astra.quill@example.test";
    readonly firstName: "Astra";
    readonly lastName: "Quill";
};
declare const DEFAULT_ORGANIZATION: {
    readonly name: "Orbit Foundry";
};
declare const SECONDARY_ORGANIZATION: {
    readonly name: "Nova Athletics";
};
declare const ORGANIZATIONS: readonly [{
    readonly name: "Orbit Foundry";
}, {
    readonly name: "Nova Athletics";
}];
declare const PRIMARY_ATHLETE: {
    readonly email: "kiro.flux@example.test";
    readonly firstName: "Kiro";
    readonly lastName: "Flux";
};
declare const PRIMARY_ATHLETE_ROW: {
    readonly password: "powercoach-demo";
    readonly email: "kiro.flux@example.test";
    readonly firstName: "Kiro";
    readonly lastName: "Flux";
};
declare const SECONDARY_ATHLETE: {
    readonly email: "nexa.vale@example.test";
    readonly firstName: "Nexa";
    readonly lastName: "Vale";
};
declare const SECONDARY_ATHLETE_ROW: {
    readonly password: "powercoach-demo";
    readonly email: "nexa.vale@example.test";
    readonly firstName: "Nexa";
    readonly lastName: "Vale";
};
declare const TERTIARY_ATHLETE: {
    readonly email: "tomo.pixel@example.test";
    readonly firstName: "Tomo";
    readonly lastName: "Pixel";
};
declare const TERTIARY_ATHLETE_ROW: {
    readonly password: "powercoach-demo";
    readonly email: "tomo.pixel@example.test";
    readonly firstName: "Tomo";
    readonly lastName: "Pixel";
};
declare const DEFAULT_ORGANIZATION_ATHLETES: readonly [{
    readonly email: "kiro.flux@example.test";
    readonly firstName: "Kiro";
    readonly lastName: "Flux";
}, {
    readonly email: "nexa.vale@example.test";
    readonly firstName: "Nexa";
    readonly lastName: "Vale";
}];
declare const ATHLETES: readonly [{
    readonly email: "kiro.flux@example.test";
    readonly firstName: "Kiro";
    readonly lastName: "Flux";
}, {
    readonly email: "nexa.vale@example.test";
    readonly firstName: "Nexa";
    readonly lastName: "Vale";
}, {
    readonly email: "tomo.pixel@example.test";
    readonly firstName: "Tomo";
    readonly lastName: "Pixel";
}];
declare const ATHLETE_ROWS: readonly [{
    readonly password: "powercoach-demo";
    readonly email: "kiro.flux@example.test";
    readonly firstName: "Kiro";
    readonly lastName: "Flux";
}, {
    readonly password: "powercoach-demo";
    readonly email: "nexa.vale@example.test";
    readonly firstName: "Nexa";
    readonly lastName: "Vale";
}, {
    readonly password: "powercoach-demo";
    readonly email: "tomo.pixel@example.test";
    readonly firstName: "Tomo";
    readonly lastName: "Pixel";
}];
declare const DEFAULT_ORGANIZATION_ID: 1;
declare const SECONDARY_ORGANIZATION_ID: 2;
declare const COACH_ID: 10;
declare const PRIMARY_ATHLETE_ID: 11;
declare const SECONDARY_ATHLETE_ID: 12;
declare const TERTIARY_ATHLETE_ID: 13;
declare const COACH_RESPONSE: {
    readonly id: 10;
    readonly email: "astra.quill@example.test";
    readonly firstName: "Astra";
    readonly lastName: "Quill";
};
declare const DEFAULT_ORGANIZATION_RESPONSE: {
    readonly id: 1;
    readonly name: "Orbit Foundry";
};
declare const SECONDARY_ORGANIZATION_RESPONSE: {
    readonly id: 2;
    readonly name: "Nova Athletics";
};
declare const PRIMARY_ATHLETE_RESPONSE: {
    readonly id: 11;
    readonly organizationId: 1;
    readonly email: "kiro.flux@example.test";
    readonly firstName: "Kiro";
    readonly lastName: "Flux";
};
declare const SECONDARY_ATHLETE_RESPONSE: {
    readonly id: 12;
    readonly organizationId: 1;
    readonly email: "nexa.vale@example.test";
    readonly firstName: "Nexa";
    readonly lastName: "Vale";
};
declare const TERTIARY_ATHLETE_RESPONSE: {
    readonly id: 13;
    readonly organizationId: 2;
    readonly email: "tomo.pixel@example.test";
    readonly firstName: "Tomo";
    readonly lastName: "Pixel";
};
declare const SETTINGS_RESPONSE: {
    readonly defaultOrganizationId: 1;
};
declare const ROSTER_RESPONSE: {
    readonly athletes: readonly [{
        readonly id: 11;
        readonly organizationId: 1;
        readonly email: "kiro.flux@example.test";
        readonly firstName: "Kiro";
        readonly lastName: "Flux";
    }, {
        readonly id: 12;
        readonly organizationId: 1;
        readonly email: "nexa.vale@example.test";
        readonly firstName: "Nexa";
        readonly lastName: "Vale";
    }];
    readonly coach: {
        readonly id: 10;
        readonly email: "astra.quill@example.test";
        readonly firstName: "Astra";
        readonly lastName: "Quill";
    };
    readonly organizations: readonly [{
        readonly id: 1;
        readonly name: "Orbit Foundry";
    }, {
        readonly id: 2;
        readonly name: "Nova Athletics";
    }];
};
declare const SECONDARY_ORGANIZATION_ROSTER_RESPONSE: {
    readonly athletes: readonly [{
        readonly id: 13;
        readonly organizationId: 2;
        readonly email: "tomo.pixel@example.test";
        readonly firstName: "Tomo";
        readonly lastName: "Pixel";
    }];
    readonly coach: {
        readonly id: 10;
        readonly email: "astra.quill@example.test";
        readonly firstName: "Astra";
        readonly lastName: "Quill";
    };
    readonly organizations: readonly [{
        readonly id: 1;
        readonly name: "Orbit Foundry";
    }, {
        readonly id: 2;
        readonly name: "Nova Athletics";
    }];
};
declare const GHOST_COACH_EMAIL: "ghost.coach@example.test";
declare const MISSING_SETTINGS_COACH: {
    readonly email: "missing.settings@example.test";
    readonly firstName: "Missing";
    readonly lastName: "Settings";
    readonly password: "powercoach-demo";
};
declare const NO_ORGANIZATIONS_COACH: {
    readonly email: "no.organizations@example.test";
    readonly firstName: "No";
    readonly lastName: "Organizations";
    readonly password: "powercoach-demo";
};
declare const EMPTY_ORGANIZATION: {
    readonly name: "Empty Athletics";
};

declare const NEON_DATABASE_URL: "postgresql://user:password@region.neon.tech/neondb?sslmode=require";
declare const POOLED_NEON_DATABASE_URL: "postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require";
declare const TEST_DATABASE_URL: "postgres://test:test@localhost:55000/test_00000000-0000-4000-0000-000000000000";
declare const LOCAL_DATABASE_URL: "postgres://postgres:postgres@localhost:5432/powercoach_dev";
declare const INVALID_DATABASE_URL: "invalid";
declare const INVALID_DATABASE_URL_PROTOCOL: "postgr://postgres:postgres@localhost:5432/powercoach_dev";
declare const UNKNOWN_DATABASE_URL_PROTOCOL: "postgre://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require";
declare const PUBLIC_HOST: "0.0.0.0";
declare const LOCAL_HOST: "localhost";
declare const INVALID_HOST: "256.256.256.256";
declare const LOG_LEVEL_INFO: "info";
declare const LOG_LEVEL_DEBUG: "debug";
declare const INVALID_LOG_LEVEL: "invalid";
declare const DEFAULT_PORT: 8080;
declare const TOO_BIG_PORT: 70000;
declare const INVALID_NODE_ENV: "invalid";

export { ATHLETES, ATHLETE_ROWS, COACH, COACH_EMAIL, COACH_ID, COACH_RESPONSE, COACH_ROW, DEFAULT_ORGANIZATION, DEFAULT_ORGANIZATION_ATHLETES, DEFAULT_ORGANIZATION_ID, DEFAULT_ORGANIZATION_RESPONSE, DEFAULT_PORT, DEMO_PASSWORD, EMPTY_ORGANIZATION, GHOST_COACH_EMAIL, INVALID_DATABASE_URL, INVALID_DATABASE_URL_PROTOCOL, INVALID_HOST, INVALID_LOG_LEVEL, INVALID_NODE_ENV, LOCAL_DATABASE_URL, LOCAL_HOST, LOG_LEVEL_DEBUG, LOG_LEVEL_INFO, MISSING_SETTINGS_COACH, NEON_DATABASE_URL, NO_ORGANIZATIONS_COACH, ORGANIZATIONS, POOLED_NEON_DATABASE_URL, PRIMARY_ATHLETE, PRIMARY_ATHLETE_ID, PRIMARY_ATHLETE_RESPONSE, PRIMARY_ATHLETE_ROW, PUBLIC_HOST, ROSTER_RESPONSE, SECONDARY_ATHLETE, SECONDARY_ATHLETE_ID, SECONDARY_ATHLETE_RESPONSE, SECONDARY_ATHLETE_ROW, SECONDARY_ORGANIZATION, SECONDARY_ORGANIZATION_ID, SECONDARY_ORGANIZATION_RESPONSE, SECONDARY_ORGANIZATION_ROSTER_RESPONSE, SETTINGS_RESPONSE, TERTIARY_ATHLETE, TERTIARY_ATHLETE_ID, TERTIARY_ATHLETE_RESPONSE, TERTIARY_ATHLETE_ROW, TEST_DATABASE_URL, TOO_BIG_PORT, UNKNOWN_DATABASE_URL_PROTOCOL };
