# Reports

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

To create a host application with two micro frontends, "billing" and "report," you can follow these steps:

### Prerequisites

- Angular CLI
- Node.js

### Step-by-Step Guide

#### 1. Set Up the Host Application

1. **Create the Host Application**:

   ```sh
   ng new host-app --routing --style=scss
   cd host-app
   ```

2. **Add Module Federation**:

   ```sh
   ng add @angular-architects/module-federation
   ```

   When prompted:

   - Enter the project name (e.g., `host-app`).
   - Enter the port number (e.g., `4200`).

3. **Configure Module Federation in the Host Application**:
   Open `projects/host-app/webpack.config.js` and configure it as follows:

   ```js
   const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

   module.exports = {
     output: {
       publicPath: "http://localhost:4200/",
     },
     plugins: [
       new ModuleFederationPlugin({
         name: "host",
         remotes: {
           billing: "billing@http://localhost:4201/remoteEntry.js",
           report: "report@http://localhost:4202/remoteEntry.js",
         },
         shared: {
           "@angular/core": { singleton: true, strictVersion: true, requiredVersion: "auto" },
           "@angular/common": { singleton: true, strictVersion: true, requiredVersion: "auto" },
           "@angular/router": { singleton: true, strictVersion: true, requiredVersion: "auto" },
         },
       }),
     ],
   };
   ```

4. **Update App Module**:
   Modify `src/app/app.module.ts` to include routing for the remote modules:

   ```typescript
   import { NgModule } from "@angular/core";
   import { BrowserModule } from "@angular/platform-browser";
   import { RouterModule } from "@angular/router";

   import { AppComponent } from "./app.component";

   @NgModule({
     declarations: [AppComponent],
     imports: [
       BrowserModule,
       RouterModule.forRoot([
         {
           path: "billing",
           loadChildren: () => import("billing/Module").then((m) => m.BillingModule),
         },
         {
           path: "report",
           loadChildren: () => import("report/Module").then((m) => m.ReportModule),
         },
       ]),
     ],
     providers: [],
     bootstrap: [AppComponent],
   })
   export class AppModule {}
   ```

5. **Run the Host Application**:
   ```sh
   ng serve --port 4200
   ```

#### 2. Set Up the Billing Micro Frontend

1. **Create the Billing Application**:

   ```sh
   ng new billing-app --routing --style=scss
   cd billing-app
   ```

2. **Add Module Federation**:

   ```sh
   ng add @angular-architects/module-federation
   ```

   When prompted:

   - Enter the project name (e.g., `billing-app`).
   - Enter the port number (e.g., `4201`).

3. **Configure Module Federation in the Billing Application**:
   Open `projects/billing-app/webpack.config.js` and configure it as follows:

   ```js
   const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

   module.exports = {
     output: {
       publicPath: "http://localhost:4201/",
     },
     plugins: [
       new ModuleFederationPlugin({
         name: "billing",
         filename: "remoteEntry.js",
         exposes: {
           "./Module": "./src/app/billing/billing.module.ts",
         },
         shared: {
           "@angular/core": { singleton: true, strictVersion: true, requiredVersion: "auto" },
           "@angular/common": { singleton: true, strictVersion: true, requiredVersion: "auto" },
           "@angular/router": { singleton: true, strictVersion: true, requiredVersion: "auto" },
         },
       }),
     ],
   };
   ```

4. **Create a Billing Module**:
   Generate a module and component to expose:

   ```sh
   ng generate module billing --route billing --module app.module
   ng generate component billing/billing-component
   ```

5. **Update Billing Module**:
   Modify `src/app/billing/billing.module.ts` to declare the billing component:

   ```typescript
   import { NgModule } from "@angular/core";
   import { CommonModule } from "@angular/common";
   import { RouterModule } from "@angular/router";
   import { BillingComponent } from "./billing-component/billing-component.component";

   @NgModule({
     declarations: [BillingComponent],
     imports: [
       CommonModule,
       RouterModule.forChild([
         {
           path: "",
           component: BillingComponent,
         },
       ]),
     ],
   })
   export class BillingModule {}
   ```

6. **Run the Billing Application**:
   ```sh
   ng serve --port 4201
   ```

#### 3. Set Up the Report Micro Frontend

1. **Create the Report Application**:

   ```sh
   ng new report-app --routing --style=scss
   cd report-app
   ```

2. **Add Module Federation**:

   ```sh
   ng add @angular-architects/module-federation
   ```

   When prompted:

   - Enter the project name (e.g., `report-app`).
   - Enter the port number (e.g., `4202`).

3. **Configure Module Federation in the Report Application**:
   Open `projects/report-app/webpack.config.js` and configure it as follows:

   ```js
   const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

   module.exports = {
     output: {
       publicPath: "http://localhost:4202/",
     },
     plugins: [
       new ModuleFederationPlugin({
         name: "report",
         filename: "remoteEntry.js",
         exposes: {
           "./Module": "./src/app/report/report.module.ts",
         },
         shared: {
           "@angular/core": { singleton: true, strictVersion: true, requiredVersion: "auto" },
           "@angular/common": { singleton: true, strictVersion: true, requiredVersion: "auto" },
           "@angular/router": { singleton: true, strictVersion: true, requiredVersion: "auto" },
         },
       }),
     ],
   };
   ```

4. **Create a Report Module**:
   Generate a module and component to expose:

   ```sh
   ng generate module report --route report --module app.module
   ng generate component report/report-component
   ```

5. **Update Report Module**:
   Modify `src/app/report/report.module.ts` to declare the report component:

   ```typescript
   import { NgModule } from "@angular/core";
   import { CommonModule } from "@angular/common";
   import { RouterModule } from "@angular/router";
   import { ReportComponent } from "./report-component/report-component.component";

   @NgModule({
     declarations: [ReportComponent],
     imports: [
       CommonModule,
       RouterModule.forChild([
         {
           path: "",
           component: ReportComponent,
         },
       ]),
     ],
   })
   export class ReportModule {}
   ```

6. **Run the Report Application**:
   ```sh
   ng serve --port 4202
   ```

### 4. Access the Micro Frontends from the Host Application

Now, when you navigate to `http://localhost:4200/billing`, the host application should load the billing module from the billing application. Similarly, navigating to `http://localhost:4200/report` should load the report module from the report application.

### Summary

By following these steps, you've set up a host application with two micro frontends (billing and report) using Angular and Module Federation. This setup allows for modular and scalable frontend architecture, enabling different teams to work independently on different parts of the application.
