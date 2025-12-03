declare namespace Cypress {
    interface Chainable {
        nrlLogin: () => Chainable<any>;
        clickButton : (buttonLabel:string) => Chainable<Element>;
        richTextBoxEdit : (textLabel:string,textToType:string) => Chainable<Element>;
        selectRadio: (questionLabel: string, value: string, reasonText?: string)=> Chainable<JQuery<HTMLElement>>;
        selectDropdown :(dropdownName:string,departmentName:string) => Chainable<Element>

        
    }
}