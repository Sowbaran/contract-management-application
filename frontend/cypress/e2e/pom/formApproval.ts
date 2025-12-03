 
import { formElements } from "../selectors/contractFormSelectors";


export class ApproveRequestsPage {
clickApproveRequestsTab() {
    cy.contains('button', 'Approve Requests').click().then(() => {
    cy.log('Clicked Approve Requests tab');
    });
}

verifyApproveRequestsTabActive() {
    cy.get(formElements.approveRequestTab, { timeout: 20000 })
    .should('contain.text', 'Approve Requests')
    .then(($el) => {
        cy.log('Tab is active, text found:', $el.text());
    });

    cy.log('Searching for formId from test data');

    cy.readFile('cypress/fixtures/formCreation.json').then((formData) => {
    const formId = formData["testData_01"].Id;
    
    cy.wait(2000);
    cy.get(formElements.search).should('be.visible')
        .type(formId)
        .then(() => {
        cy.log(`Entered formId: ${formId} into search box`);
        });

    cy.wait(1000);
    
        cy.xpath('//table/tbody/tr/td/button/p').click();
        cy.wait(1000);
        cy.xpath(formElements.monetaryValueDetailsPage).invoke('text').then((text) =>{
        const data = text.replace(/,/g, '')
        const monetaryValue = parseInt(data)
        expect(monetaryValue).to.be.a('number')
        cy.xpath(formElements.techBypass).invoke('text').then((techApproval) =>{
        cy.xpath(formElements.typeOfApproval).invoke('text').then((typeOfApproval) =>{
        if(monetaryValue <= 19999 && (typeOfApproval === "Expenditure Contract" || typeOfApproval === "Expenditure no contract for signing" || typeOfApproval === "Master Services Agreement" || typeOfApproval === "Revenue Contract")) {
            cy.log('inside monetaryValue < 20000')
            cy.xpath(formElements.egm).should('exist')
            cy.xpath(formElements.legal).should('exist')
            cy.xpath(formElements.technology).should('not.exist')
            cy.log('text', techApproval)
            for(let i=1; i<=1; i++){
                this.approveButton()
            cy.wait(3000)
            this.clickApproveRequestsTab()
            cy.wait(2000)
            this.searchId()
            cy.wait(2000)
            }
            cy.contains('Approve').should('be.visible').click({force:true});
            cy.wait(2000);
            this.esignNoRequired()
            }
            else if(monetaryValue > 19999 && monetaryValue < 250000 && (typeOfApproval === "Expenditure Contract" || typeOfApproval === "Expenditure no contract for signing" || typeOfApproval === "Master Services Agreement" || typeOfApproval === "Revenue Contract")) {
            cy.log('inside monetaryValue > 20000')
            cy.xpath(formElements.egm).should('exist')
            this.verifyTechApproval(techApproval)
            cy.xpath(formElements.legal).should('exist')
            cy.xpath(formElements.insurance).should('exist')
            cy.xpath(formElements.finance).should('exist')
            cy.xpath(formElements.cfo).should('exist')
            cy.log('text', typeOfApproval)
            let n=4;
            if(techApproval === 'Yes'){
            n = n+1;
            }
            for(let i=1; i<=n; i++){
            this.approveButton()
            cy.wait(3000)
            this.clickApproveRequestsTab()
            cy.wait(2000)
            this.searchId()
            cy.wait(2000)
            }
            cy.log('Outside for loop')
            cy.contains('Approve').should('be.visible').click({force:true});
            cy.wait(2000);
            this.esignNoRequired()
            
        }
        else if(monetaryValue > 249999 && (typeOfApproval === "Expenditure Contract" || typeOfApproval === "Expenditure no contract for signing" || typeOfApproval === "Master Services Agreement" || typeOfApproval === "Revenue Contract")) {
        cy.log('inside monetaryValue > 249999')
        cy.xpath(formElements.egm).should('exist')
        this.verifyTechApproval(techApproval)
        cy.xpath(formElements.legal).should('exist')
        cy.xpath(formElements.insurance).should('exist')
        cy.xpath(formElements.finance).should('exist')
        cy.xpath(formElements.cfo).should('exist')
        cy.xpath(formElements.ceo).should('exist')
        cy.log('text', typeOfApproval)
        let n=5;
            if(techApproval === 'Yes'){
            n = n+1;
            }
            for(let i=1; i<=n; i++){
            this.approveButton()
            cy.wait(3000)
            this.clickApproveRequestsTab()
            cy.wait(2000)
            this.searchId()
            cy.wait(2000)
            }
            cy.log('Outside for loop')
            cy.contains('Approve').should('be.visible').click({force:true});
            cy.wait(2000);
            this.esignWitnessRequired()
        
    }
        else{
            cy.log('deed', typeOfApproval)
            cy.xpath(formElements.legal).should('exist')
            cy.xpath(formElements.cfo).should('exist')
            cy.log("deed passed")
        }
        })
    })
    })  
    });
}
verifyTechApproval(data: string){
    if(data === "Yes"){
    cy.xpath(formElements.technology).should('exist')
        }
    else{
        cy.xpath(formElements.technology).should('not.exist')
    }  
}

approveOrRejectForm(data: string) {
    cy.log('Approving or rejecting form');
    if(data=="Approve"){
    try {
        cy.scrollTo('top', { duration: 1000 }).then(() => {
        cy.log('Scrolled to top');
    });
    
        cy.contains('Approve').should('be.visible').click({force:true});
    
    cy.xpath(formElements.okayButton).click()
    cy.get('dialog').should('not.be.visible');

    } catch (error) {
    cy.log('approved dialog box not appeared');
    }
    cy.scrollTo('top', { duration: 1000 }).then(() => {
        cy.log('Scrolled to top');
    });
    }
    else{
    cy.wait(2000);
    cy.contains('Reject').should('be.visible').click({force:true});
            
        cy.xpath(formElements.rejectReason).type("no")
    cy.xpath(formElements.rejectButton).click()
    cy.get('dialog').should('not.be.visible');
    }
}
searchId(){
    cy.readFile('cypress/fixtures/formCreation.json').then((formData1) => {
    const formId = formData1["testData_01"].Id;
    
    cy.wait(2000);
    cy.get(formElements.search, { timeout: 15000 }).should('be.visible')
        .type(formId)
        .then(() => {
        cy.log(`Entered formId: ${formId} into search box`);
        });
    cy.wait(1000);
    cy.xpath(formElements.formId).click()
    cy.wait(1000);
})
}
approveButton(){
    cy.log('Approving form');
    cy.contains('Approve').should('be.visible').click({force:true});
    cy.xpath(formElements.okayButton).click()
    cy.get('dialog').should('not.be.visible');
    }
    
esignYesRequired(){
cy.xpath(formElements.esignYes).click();
cy.xpath(formElements.witnessNo).click();
cy.xpath(formElements.approveButton).click();
    }

    esignWitnessRequired(){
    cy.xpath(formElements.esignYes).click();
    cy.xpath(formElements.witnessYes).click();
    cy.get(formElements.witnessName).type('Ashok');
    cy.get(formElements.witnessId).type('asaminathan@nrl.com.au');
    cy.xpath(formElements.approveButton).click();
    }

esignNoRequired(){
cy.xpath(formElements.esignNo).click();
cy.xpath(formElements.approveButton).click();
}

}
