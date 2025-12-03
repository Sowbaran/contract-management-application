
import { formElements } from "../selectors/contractFormSelectors";

export class formCreation {
    gmResponse: any;
    constructor() {}

    newForm = (formDetails:any) => {
        cy.readFile('cypress/fixtures/formCreation.json').then((formData:any) => {
            const data = formData[formDetails];

            cy.clickButton('New Request'); 
            cy.intercept('GET', `${Cypress.env('VITE_API_URL')}/forms/gmUser/**`).as('getDepartmentData');
            cy.selectDropdown('Players', data.Department);
            
            cy.wait('@getDepartmentData')
            cy.wait('@getDepartmentData').then((interception) => {
                try {
                    const response = interception.response?.body;
                    const responseData = response.data;
                    const message = response.message;
                    cy.log(`Response message: ${message}`);
                    cy.log(`Response data length: ${responseData.length}`);
                    const validUser = responseData.find((user:any) => user.userName === data.GM);
                    cy.log(`Valid user: ${validUser?.userName}`);

                    if (message === 'GM users are been retrived' && validUser && responseData.length >= 2) {
                        cy.selectDropdown('Select First Reviewer', data.GM);
                    }

                    this.gmResponse = response;
                    cy.wait(2000);
                } catch (err:any) {
                    cy.log('Error while processing GM user response: ' + err.message);
                    throw err;
                }
            });

            cy.selectDropdown('Select from list', data.approvalType);
            cy.selectDropdown('Select Our Entity', data.contractingEntity);
            cy.richTextBoxEdit('Business Case', data.businessCase);
            cy.richTextBoxEdit('Description of Agreement ', data.Agreement);
            cy.get(formElements.term).type(data.Term);
            cy.get(formElements.counterParty).type(data.counterParty);
            cy.get(formElements.monetaryValue).type(data.monetaryVal);

            if (!data.Currency) {
                cy.log("Please select the currency")
                return;
            } else if(data.Currency === 'Other'){
                cy.selectDropdown('AUD', data.Currency);
                cy.get(formElements.other).type(data.other)
                cy.get(formElements.currencyNotAUD).type(data.currencyNotAUD);
            } else if(data.Currency !== 'AUD') {
                cy.selectDropdown('AUD', data.Currency);
                cy.get(formElements.currencyNotAUD).type(data.currencyNotAUD);
            }

            cy.richTextBoxEdit(`relevant financial year’s budget?`, data.budgetYearInclusion);
            cy.selectRadio('A$1million', data.SSTApproval, 'NewOneNoBox');
            cy.get(formElements.termination).type(data.termination);
            cy.get(formElements.risk).type(data.risk);
            cy.get(formElements.splTermsText).type(data.splTerms);

            if (data.approvalType === 'Expenditure Contract' || data.approvalType === 'Expenditure no contract for signing') {
                cy.richTextBoxEdit('procurement process ', data.expenditureSummary);
                cy.richTextBoxEdit(`Indigenous supplier framework was managed `, data.expenditureSupplier);
                cy.selectRadio(`between $20-50k`, data.expenditureQuota);
            }

            cy.selectRadio(`Arm’s Length Transactions:`, data.armLength);
            cy.selectRadio(`credit check been undertaken`, data.creditCheck);
            cy.selectRadio(`the Modern Slavery Questionnaire`, data.slaveryQues);
            cy.selectRadio(`the Supplier Code of Conduct Policy?`, data.suplierCodeOfConduct);
            cy.selectRadio(`Is the contract a CapEx item`, data.CapEx);
            cy.selectRadio(`tech review?`, data.techReview);
            cy.richTextBoxEdit(`(Internal or external)`, "test");
            cy.richTextBoxEdit(`If external, what type of engagement?`, "test");
            cy.richTextBoxEdit(`What internal resources are required to support`, "test");

            cy.get('input[type="file"][class="filepond--browser"]').attachFile('test.pdf', { subjectType: 'input' });
            cy.wait(7000);

            cy.intercept('POST', `${Cypress.env('VITE_API_URL')}/forms/contract/create`).as('submitRequest');
            cy.clickButton('Submit');

            cy.wait('@submitRequest').then((interception) => {
                try {
                    const requestBody = interception.request.body;
                    cy.log('Request Body:', requestBody);
                    const newFormId = requestBody.code;
                    formData[formDetails].Id = newFormId;
                    cy.log(data.Id);
                    cy.writeFile('cypress/fixtures/formCreation.json', formData);
                    cy.log('Created Form ID:', newFormId);
                } catch (err:any) {
                    cy.log('Error during form submission: ' + err.message);
                    throw err;
                }
            });
        });

        // cy.clickButton('New Request');
        // this.draftCreation();
    }

    ValidateFormCreation = (formDetails:any) => {
        cy.readFile('cypress/fixtures/formCreation.json').then((formData:any) => {
            const data = formData[formDetails];
            const formId = data.Id;
            cy.log(formId);
            cy.get(formElements.search)
                .clear()
                .type(formId)
                .then(() => {
                    cy.get('tbody tr').should('have.length', 1);
                    cy.contains('button[type="submit"] p', formId).should('exist');
                });
            })
        }

    draftCreation = () => {
        cy.intercept("POST",` ${Cypress.env('VITE_API_URL')}/forms/draft/contract/create`).as("submitDraft");

        cy.clickButton('Save as Draft');
        cy.wait('@submitDraft').then((interception) => {
            try {
                const draftRequest = interception.request.body;
                const draftID = draftRequest.code;
                this.ValidateFormCreation(draftID);
            } catch (err:any) {
                cy.log('Error during draft creation: ' + err.message);
                throw err;
            }
        });
    }
}

