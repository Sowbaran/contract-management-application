const { defineConfig } = require('cypress')
require('dotenv').config()
module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  env: {
    baseUrl: process.env.VITE_APP_REDIRECT_URL,
    USERNAME: process.env.VITE_APP_CYPRESS_USER,
    PASSWORD: process.env.VITE_APP_CYPRESS_CREDENTIAL,
    VITE_API_URL:process.env.VITE_API_URL,
    // TAGS: "@sanity",
   
  },
  e2e: {
    supportFile: 'cypress/support/e2e.ts', 
    specPattern: 'cypress/e2e/features/*.feature',
    async setupNodeEvents(on, config) {
      const createEsbuildPlugin = require('@badeball/cypress-cucumber-preprocessor/esbuild').createEsbuildPlugin
      const createBundler = require('@bahmutov/cypress-esbuild-preprocessor')
      await require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin(on, config)
      on('file:preprocessor',   createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
     return config
    
    
     
    },
    screenshotOnRunFailure: true,
    chromeWebSecurity: true,
    screenshotsFolder: 'cypress/screenshots/picture',
    videosFolder: 'cypress/videos',
    video: false,
    testIsolation: false,
    defaultCommandTimeout: 16000,
    requestTimeout: 40000,
    responseTimeout: 40000,
    experimentalModifyObstructiveThirdPartyCode: true,
    experimentalOriginDependencies: true,
    experimentalInteractiveRunEvents: false,
    experimentalCspAllowList: true,
  },
})
