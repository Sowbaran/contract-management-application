import { formElements } from "../selectors/contractFormSelectors";
type RolePermissions = {
  [key: string]: {
    tabs: string[];
    menus: string[];
  };
};
type ValidationMap = {
  myRequestTabValidiation: () => void;
  myTeamRequestTabValidation: () => void;
  myApprovalTabValidation: () => void;
  validateApprovedListTab: () => void;
  validateESignTab: () => void;
};
const rolePermissions :RolePermissions  = {
  "Requester": { tabs: ["myRequestTabValidiation"], menus: ["forms"] },
  "General Manager": { tabs: ["myRequestTabValidiation", "myApprovalTabValidation", "validateApprovedListTab", "validateESignTab"], menus: ["forms"] },
  "Chief Executive Officer": { tabs: ["myRequestTabValidiation", "myApprovalTabValidation", "validateApprovedListTab", "validateESignTab"], menus: ["forms", "dashboard"] },
  "Chief Financial Officer": { tabs: ["myRequestTabValidiation", "myApprovalTabValidation", "validateApprovedListTab", "validateESignTab"], menus: ["forms", "dashboard"] },
  "Finance Admin": { tabs: ["myRequestTabValidiation", "myTeamRequestTabValidation", "myApprovalTabValidation", "validateApprovedListTab", "validateESignTab"], menus: ["forms", "dashboard"] },
  "Legal Admin": { tabs: ["myRequestTabValidiation", "myApprovalTabValidation", "validateApprovedListTab", "validateESignTab"], menus: ["forms"] },
  "Insurance Admin": { tabs: ["myRequestTabValidiation", "myApprovalTabValidation", "validateApprovedListTab", "validateESignTab"], menus: ["forms"] },
  "Technology Admin": { tabs: ["myRequestTabValidiation", "myApprovalTabValidation", "validateApprovedListTab", "validateESignTab"], menus: ["forms"] },
  "Executive General Manager": { tabs: ["myRequestTabValidiation", "myApprovalTabValidation", "validateApprovedListTab", "validateESignTab"], menus: ["forms"] },
  "Super Admin": { tabs: ["myRequestTabValidiation", "myTeamRequestTabValidation", "myApprovalTabValidation", "validateApprovedListTab", "validateESignTab"], menus: ["forms", "dashboard", "configuration", "settings"] }
};

const isSuperAdmin = (roleNames: string[]) => roleNames.includes("Super Admin");

const isMatchingEntry = ({ entry, user, statusCondition = [], statusCompare = "equals" }: { entry: any, user: string, statusCondition?: string[], statusCompare?: string }) => {
  const emailMatch = entry.approvedBy === user;
  const status = entry.status?.toLowerCase();
  const statusMatch =
    statusCompare === "equals"
      ? statusCondition.includes(status)
      : !statusCondition.includes(status);

  return  emailMatch && statusMatch 
};

export class tabValidation {
  constructor() {}

  premissionCheck = () => {
    const user = Cypress.env("USERNAME");
    const roles = Cypress.env("roles");
    const roleNames = this.getUserRoles(roles);

    cy.log("User Roles:", roleNames);

    this.handleTabs(roleNames, user);
    this.handleMenus(roleNames);
  };
  
  getUserRoles = (roles: any[]) => {
    const roleNameMap : Record<string, string> = {
      "First Reviewer": "General Manager",
      CEO: "Chief Executive Officer",
      CFO: "Chief Financial Officer",
    };
    return roles.map((r) => roleNameMap[r.name] || r.name);
  };

  handleTabs = (roleNames: string[], user: string): void => {
    const alreadyCalled = new Set();

    roleNames.forEach((role) => {
      const permissions = rolePermissions[role];
      if (!permissions) return;

      permissions.tabs.forEach((tabMethod: any) => {
        if (!alreadyCalled.has(tabMethod)) {
          alreadyCalled.add(tabMethod);
          this.runTabValidation(tabMethod, roleNames, user);
        }
      });
    });
  };

  runTabValidation = (method: keyof ValidationMap, roleNames: string[], user: any) => {
    const validationMap : ValidationMap = {
      myRequestTabValidiation: () => this.myRequestTabValidiation(user),
      myTeamRequestTabValidation: () => this.myTeamRequestTabValidation(),
      myApprovalTabValidation: () => this.myApprovalTabValidation(roleNames),
      validateApprovedListTab: () =>
        this.validateTabRows({
          tabSelector: formElements.approveListTab,
          statusCondition: ["initiated", "recall"],
          roleNames,
          user,
          statusCompare: "notEquals",
        }),
      validateESignTab: () =>
        this.validateTabRows({
          tabSelector: formElements.eSignRequestTab,
          statusCondition: ["esign-initiated"],
          roleNames,
          user,
          statusCompare: "equals",
        }),
    };

    const action = validationMap[method];
    if (action) {
      action();
    } else {
      cy.log(`Unknown tab method: ${method}`);
    }
  };

  myRequestTabValidiation = (user: any) => {
    cy.get(formElements.myRequestTab).should("exist").click();
    cy.wait(3000);
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row).find("td").eq(9).invoke("text").then((emailText) => {
        expect(emailText.trim()).to.equal(user);
      });
    });
  };

  myApprovalTabValidation = (roleNames: string[]) => {
    const isSuper = isSuperAdmin(roleNames);
    cy.intercept('GET', `${Cypress.env('VITE_API_URL')}/forms/contract/list/**`).as('List');
    cy.get(formElements.approveRequestTab).should("exist").click();
    cy.wait(3000);
    cy.wait('@List').then(({ response }) => {
      const data = response?.body?.data || [];
      if (data.length === 0) return;

      cy.get("table tbody tr").each(($row) => {
        cy.wrap($row).find("td").eq(6).invoke("text").then((workflow) => {
          const trimmed = workflow.trim();
          if (!isSuper) {
            expect(roleNames).to.include(trimmed);
          } else {
            cy.log(`Super Admin sees: ${trimmed}`);
          }
        });
      });
    });
  };

  myTeamRequestTabValidation = () => {
    cy.get(formElements.teamRequestTab).should("exist").click();
  };

validateTabRows = ({ tabSelector,statusCondition,roleNames,user,statusCompare = 'equals',}: {tabSelector: string;statusCondition: string[];roleNames: string[];user: string;statusCompare: string;}) => {
  const isSuper = isSuperAdmin(roleNames);

  cy.intercept('GET', `${Cypress.env('VITE_API_URL')}/forms/contract/list/**`).as('List');
  cy.intercept('GET', `${Cypress.env('VITE_API_URL')}/forms/contract/history/**`).as('formHistoryList');

  cy.get(tabSelector).should('exist').click();
  cy.wait(3000);

  cy.wait('@List').then(({ response }) => {
    const data = response?.body?.data || [];
    if (data.length === 0) return;

    if (tabSelector === formElements.eSignRequestTab && isSuper) {
      return;
    }
    let rowNo = 0;
    const processRow = (index: number) => {
      
      cy.get('table tbody tr').eq(rowNo).then(($row) => {
        console.log("rowNO in:",rowNo)
        cy.wrap($row).find('td').eq(10).find('button[title="History"]').click({ force: true });

        cy.wait('@formHistoryList').then(({ response }) => {
          const entries = response?.body?.data || [];

          const matched = entries.some((entry: any) =>
            isMatchingEntry({ entry, user, statusCondition, statusCompare })
          );
          cy.log(`Row ${index + 1} match: ${matched}`);
          expect(matched, `Row ${index + 1} should match validation`).to.be.true;
          // Re-query the button to close after clicking
          cy.get('button.cursor-pointer.relative.z-20').should('be.visible').click({ force: true });

          cy.wait(1000); // Wait before processing the next row

          // Process the next row
          if (index + 1 < data.length) {
            if((rowNo + 1)%10 === 0 && rowNo !== 0){
              rowNo = 0;
              cy.xpath(`//button[normalize-space()='Next']`).click();
            }else{ rowNo += 1; }
            console.log("rowNO out:",rowNo)
            processRow(index + 1); // Recursively call to process the next row
          }
        });
      });
    };
    processRow(0);
  });
};


  handleMenus = (roleNames: string[]) => {
    roleNames.forEach((role: string | number) => {
      const permissions = rolePermissions[role];
      if (!permissions) return;

      permissions.menus.forEach((menu: string) => {
        const selector = formElements[menu as keyof typeof formElements];
;
        if (!selector && menu !== 'settings') {
          cy.log(`No selector defined for menu: ${menu}`);
          return;
        }

        if (menu === "settings") {
          this.openSettingsAndValidate();
        } else {
          cy.get(selector).should("exist");
        }
      });
    });
  };

    openSettingsAndValidate = () => {
    cy.get(formElements.moduleMenu).should("exist").click({ force: true });
    cy.contains('button', 'Settings').should('be.visible').click({ force: true });
    cy.get(formElements.userSettings).should("exist")
    cy.get(formElements.roleSettings).should("exist")
    cy.get(formElements.permissionSettings).should("exist")
    cy.get(formElements.moduleSettings).should("exist")
    cy.get(formElements.departmentSettings).should("exist")
    cy.get(formElements.moduleMenu).should("exist").click({ force: true });
    cy.contains('button', "Contract Approval").click({ force: true });
    };
}
