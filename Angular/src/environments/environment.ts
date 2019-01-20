// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  VERSION: require('../../package.json').version,
  api_url: "http://localhost:5000/api/",
  read_the_docs: "https://moneygrip.readthedocs.io/nl/latest/",
  app_name: "MoneyGrip"
};
