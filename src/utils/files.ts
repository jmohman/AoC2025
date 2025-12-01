import { readFileSync } from "fs";

export function readContent(example:boolean = false): string {
  return readFileSync(example ? "example.txt" : "input.txt", "utf8");
}

export function readLines(example:boolean = false): string[] {
  return readContent(example).split(/\r\n/);
}

export function readSplitLines(splitBy:string = " ", example:boolean = false): string[][] {
  return readContent(example).split(/\r\n/).map(line => line.split(splitBy));
}
