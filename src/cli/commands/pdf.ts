import { readFile, writeFile } from "fs/promises";
import { convert } from "libreoffice-convert";
import { promisify } from "util";
import type { Arguments, CommandBuilder } from "yargs";

type Options = {
  name: string;
  pdf: boolean | undefined;
  location: string | undefined;
};

export const command: string = "pdf <name>";
export const desc: string = `Convert ODT to PDF <name> with --pdf`;

export const builder: CommandBuilder<Options, Options> = (yargs) => {
  return yargs
    .options({
      pdf: { type: "boolean" },
      location: { type: "string" },
    })
    .positional("name", { type: "string", demandOption: true });
};

export const handler = async (argv: Arguments<Options>): Promise<void> => {
  const { name, pdf, location } = argv;
  try {
    if (pdf) {
      const ext = ".pdf";
      const convertAsync = promisify(convert);
      const odtBuffer = await readFile(name);

      const pdfBuffer = await convertAsync(odtBuffer, ext, undefined);

      await writeFile(location, pdfBuffer);
    }

    process.stdout.write("Converted with success!");
  } catch (e) {
    process.stdout.write("Error in convertion", e);
  };

  process.exit(0);
};
