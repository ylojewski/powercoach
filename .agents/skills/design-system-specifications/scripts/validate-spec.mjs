#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const REQUIRED_SECTIONS = ["Overview", "Anatomy", "Examples", "Use Cases"];
const STANDARD_SECTIONS = new Set([
  ...REQUIRED_SECTIONS,
  "Accessibility",
  "Behavior",
  "Motion"
]);
const PACKAGE_NAME = "@powercoach/ui";
const PASCAL_CASE_NAME = /^[A-Z][A-Za-z0-9]*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function unique(values) {
  return new Set(values).size === values.length;
}

function monotonic(values) {
  const numbers = values.map((value) => Number(value.split("-")[1]));
  return numbers.every((value, index) => index === 0 || value > numbers[index - 1]);
}

function exportAllows(exportsField, subpath) {
  if (subpath === ".") return Boolean(exportsField?.["."]);
  if (exportsField?.[subpath]) return true;

  return Object.keys(exportsField ?? {}).some((key) => {
    if (!key.includes("*")) return false;
    const [prefix, suffix] = key.split("*");
    return subpath.startsWith(prefix) && subpath.endsWith(suffix);
  });
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;

  const values = {};
  const unknown = [];

  for (const line of match[1].split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const fieldMatch = trimmed.match(/^([A-Za-z]+):\s*(.+)$/);
    if (!fieldMatch) {
      unknown.push(trimmed);
      continue;
    }

    const [, key, value] = fieldMatch;
    if (!["revision", "date"].includes(key)) unknown.push(key);
    values[key] = value.trim();
  }

  return { unknown, values };
}

export function validateSpecText(
  markdown,
  {
    expectedName,
    kind,
    packageExports
  } = {}
) {
  const issues = [];
  const frontmatter = parseFrontmatter(markdown);
  const titles = [...markdown.matchAll(/^# ([^\n]+)$/gm)].map((match) =>
    match[1].trim()
  );
  const sections = [...markdown.matchAll(/^## ([^\n]+)$/gm)].map((match) =>
    match[1].trim()
  );
  const allExamples = [...markdown.matchAll(/^### (EX-\d+)\b/gm)].map(
    (match) => match[1]
  );
  const allUseCases = [...markdown.matchAll(/^### (UC-\d+)\b/gm)].map(
    (match) => match[1]
  );
  const examples = allExamples.filter((id) => /^EX-\d{3}$/.test(id));
  const useCases = allUseCases.filter((id) => /^UC-\d{3}$/.test(id));

  if (!frontmatter) {
    issues.push("Spec must start with revision/date frontmatter");
  } else {
    const revision = frontmatter.values.revision;
    const date = frontmatter.values.date;

    if (frontmatter.unknown.length > 0) {
      issues.push("Spec frontmatter must contain only revision and date");
    }
    if (!revision) {
      issues.push("Spec frontmatter missing revision");
    } else if (!/^[1-9]\d*$/.test(revision)) {
      issues.push("Spec revision must be a positive integer");
    }
    if (!date) {
      issues.push("Spec frontmatter missing date");
    } else if (!ISO_DATE.test(date)) {
      issues.push("Spec date must use YYYY-MM-DD");
    }
  }

  if (titles.length !== 1) issues.push("Spec must contain exactly one H1 title");
  const title = titles[0];
  if (title && !PASCAL_CASE_NAME.test(title)) {
    issues.push("Spec title must be a PascalCase public name");
  }
  if (expectedName && title !== expectedName) {
    issues.push(`Spec title must match filename: ${expectedName}`);
  }
  if (kind === "animations" && title && !title.endsWith("Animation")) {
    issues.push("Reusable animation name must end with Animation");
  }
  if (kind === "components" && title) {
    const partSections = sections.filter((section) => !STANDARD_SECTIONS.has(section));
    const namespaceParts = [
      ...markdown.matchAll(new RegExp(`\\b${title}\\.([A-Z][A-Za-z0-9]*)\\b`, "g"))
    ].map((match) => match[1]);
    const publicParts = [...new Set([...partSections, ...namespaceParts])];

    if (publicParts.length === 1 && publicParts[0] === "Root") {
      issues.push("Single-part component specs must use the component name, not Root");
    }
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!sections.includes(section)) issues.push(`Missing section: ${section}`);
  }
  const requiredSectionPositions = REQUIRED_SECTIONS
    .map((section) => sections.indexOf(section))
    .filter((position) => position >= 0);
  if (
    requiredSectionPositions.some(
      (position, index) =>
        index > 0 && position <= requiredSectionPositions[index - 1]
    )
  ) {
    issues.push("Required sections are out of order");
  }
  if (examples.length === 0) issues.push("No EX-* example found");
  if (useCases.length === 0) issues.push("No UC-* use case found");
  if (allExamples.some((id) => !/^EX-\d{3}$/.test(id))) {
    issues.push("EX-* identifiers must use three digits");
  }
  if (allUseCases.some((id) => !/^UC-\d{3}$/.test(id))) {
    issues.push("UC-* identifiers must use three digits");
  }
  if (!unique(examples)) issues.push("Duplicate EX-* identifier");
  if (!unique(useCases)) issues.push("Duplicate UC-* identifier");
  if (!monotonic(examples)) issues.push("EX-* identifiers must increase");
  if (!monotonic(useCases)) issues.push("UC-* identifiers must increase");

  const exampleBlocks = markdown.split(/^### (?=EX-\d+\b)/gm).slice(1);
  const covered = new Set();

  for (const block of exampleBlocks) {
    const exampleId = block.match(/^(EX-\d+)\b/)?.[1];
    if (!/^Context:[ \t]*\S.*$/m.test(block)) {
      issues.push(`${exampleId ?? "Example"} has no Context: value`);
    }
    if (!/^Expected behavior:[ \t]*\S.*$/m.test(block)) {
      issues.push(`${exampleId ?? "Example"} has no Expected behavior: value`);
    }
    const coversLine = block.match(/^Covers:\s*(.+)$/m)?.[1];
    if (!coversLine) {
      issues.push(`${exampleId ?? "Example"} has no Covers: line`);
      continue;
    }

    const ids = [...coversLine.matchAll(/\bUC-\d+\b/g)].map(
      (match) => match[0]
    );
    if (ids.length === 0) {
      issues.push(`${exampleId} Covers: line has no UC-* identifier`);
    }
    for (const id of ids) {
      covered.add(id);
      if (!useCases.includes(id)) issues.push(`${exampleId} covers unknown ${id}`);
    }
  }

  for (const useCase of useCases) {
    if (!covered.has(useCase)) issues.push(`${useCase} is not covered by an example`);
  }

  const useCaseBlocks = markdown.split(/^### (?=UC-\d+\b)/gm).slice(1);
  for (const block of useCaseBlocks) {
    const useCaseId = block.match(/^(UC-\d+)\b/)?.[1];
    for (const step of ["Given", "When", "Then"]) {
      if (!new RegExp(`^${step}[ \\t]+\\S.*$`, "m").test(block)) {
        issues.push(`${useCaseId ?? "Use case"} has no ${step} step`);
      }
    }
  }

  if (packageExports) {
    const imports = [
      ...markdown.matchAll(/from\s+["'](@powercoach\/ui(?:\/[^"']+)?)["']/g)
    ].map((match) => match[1]);

    for (const specifier of imports) {
      const suffix = specifier.slice(PACKAGE_NAME.length);
      const subpath = suffix ? `.${suffix}` : ".";
      if (!exportAllows(packageExports, subpath)) {
        issues.push(`Package does not export ${specifier}`);
      }
    }
  }

  return {
    date: frontmatter?.values.date,
    examples,
    issues,
    revision: frontmatter?.values.revision,
    useCases
  };
}

export function validateSpecFile(specPath, packageJsonPath) {
  const markdown = fs.readFileSync(specPath, "utf8");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const normalized = specPath.split(path.sep);
  const designSystemIndex = normalized.lastIndexOf("design-system");
  const kind = normalized[designSystemIndex + 1];
  const expectedName = path.basename(specPath, path.extname(specPath));
  const result = validateSpecText(markdown, {
    expectedName,
    kind,
    packageExports: packageJson.exports
  });

  if (!["components", "animations"].includes(kind)) {
    result.issues.push(
      "Spec path must be under docs/design-system/components or animations"
    );
  }
  if (path.extname(specPath) !== ".md") {
    result.issues.push("Spec filename must use .md");
  }

  return result;
}

function runCli() {
  const specArgument = process.argv[2];
  if (!specArgument) {
    console.error("Usage: validate-spec.mjs <spec-path>");
    process.exitCode = 2;
    return;
  }

  const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
  const repositoryRoot = path.resolve(scriptDirectory, "../../../..");
  const specPath = path.resolve(process.cwd(), specArgument);
  const packageJsonPath = path.join(repositoryRoot, "packages/ui/package.json");
  const result = validateSpecFile(specPath, packageJsonPath);

  if (result.issues.length > 0) {
    console.error("Spec Validation: blocked");
    for (const issue of result.issues) console.error(`- ${issue}`);
    process.exitCode = 1;
    return;
  }

  console.log("Spec Validation: go");
  console.log(`- Spec: ${path.relative(repositoryRoot, specPath)}`);
  console.log(`- Revision: ${result.revision}`);
  console.log(`- Date: ${result.date}`);
  console.log(`- Examples: ${result.examples.length}`);
  console.log(`- Use cases: ${result.useCases.length}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) runCli();
