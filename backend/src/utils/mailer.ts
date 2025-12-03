import { Injectable } from "@nestjs/common";
import { EmailService } from "../email/email.service";
@Injectable()
export class MailerCommonService {
  private baseUrl: string;
  constructor(private readonly emailService: EmailService) {
    this.baseUrl = process.env.FRONTEND_BASE_URL || "";
  }
  //Your request has been rejected at {workflow approval stage} due to the following reason {last comment}.
  async sendHeadCountAssociateEmail(
    queryString: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    userEmails: any,
    code: string,
    type: string,
    depaertment: string,
    comments?: string,
    createdBy?: string[],
    moduleId?: string,
    formId?: string,
  ): Promise<void> {
    //cc Requester and Hiring Manager
    const baseUrlLink = `<a href="${this.baseUrl}${queryString}">Click this link to login</a>`;
    let subject = `New Headcount Request ${code}`;
    let bodyVal = `Dear Approver,<br/>
 
    <br/>You have been assigned to review the headcount request submitted for- <b> ${depaertment}. </b>  <br/>
 
    <br/> ${baseUrlLink}<br/>

    <br/> to Approve or Reject the request <br/>

    <br/> Thanks,<br/>
 
    <br/> Headcount Request System`;

    if (type === "new_role_or_budget") {
      subject = `New Headcount Request ${code}`;
      bodyVal = `Dear Approver,<br/>

      <br/>You have been assigned to review the headcount request submitted for- <b> ${depaertment}. </b>  <br/>

      <br/>The following flags have been triggered for this request:  <br/>

      <ul>
        <li>New Role</li>
        <li>In budget: N</li>
      </ul>

      <br/> ${baseUrlLink}<br/>

      <br/> to Approve or Reject the request <br/>

      <br/> Thanks,<br/>

      <br/> Headcount Request System`;
    }
    if (type === "completed") {
      //cc Last approver
      subject = `New Headcount Approved ${code}`;
      bodyVal = `Dear Requester,<br/>
      
      <br/> Your request has been reviewed and fully approved. <br/>
 
      <br/> ${baseUrlLink}<br/>

      <br/> to go to your submitted request. <br/>

      <br/> Thanks,<br/>
 
      <br/> Headcount Request System`;
    }

    if (type === "resubmit") {
      //cc Requester and Hiring Manager
      subject = `New Headcount Request ${code} - Resubmission`;
      bodyVal = `Dear Approver,<br/>
    
      <br/>You have been assigned to review the headcount request submitted for- <b> ${depaertment}. </b> <br/>
 
      <br/> ${baseUrlLink}<br/>

      <br/> to Approve or Reject the request <br/>

      <br/> Thanks,<br/>
 
      <br/> Headcount Request System`;
    }

    if (type === "rejected") {
      subject = `New Headcount Request ${code} - Rejected`;
      bodyVal = `Dear Requester,<br/>

      <br/> Your request has been rejected at <b>  ${depaertment}  </b> stage <br/>
      
      <br> due to the following reason- <b> ${comments} </b>  
 
      <br/> ${baseUrlLink}<br/>

      <br/> should you wish to resubmit the request. <br/>

      <br/> Thanks,<br/>
 
      <br/>  Headcount Request System`;
    }

    return await this.emailService.sendEmailWithTemplate(
      userEmails,
      subject,
      bodyVal,
      createdBy,
    );
  }
  async sendAssociateEmail(
    queryString: string,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    userEmails: any,
    code: string,
    type: string,
    parties: string,
    comments?: string,
    createdBy?: string,
    moduleId?: string,
    formId?: string,
  ): Promise<void> {
   const counterParties = parties && parties.length > 75
  ? parties.slice(0, 75)
  : parties;
    const baseUrlLink = `<a href="${this.baseUrl}${queryString}">Click the link to login</a>`;
    let subject = `Contract ${code} - ${type} - ${counterParties}`;
    let bodyVal = `Dear Approver,<br/>
 
    <br/>You have been assigned a contract with <b> ${parties} </b> for your review and approval.<br/>
 
    <br/> Please review the contract approval form to approve or reject.<br/>
 
    <br/> ${baseUrlLink}<br/>
 
    <br/> Thanks,<br/>
 
    <br/> Contract Approval System`;

    if (type === "completed") {
      subject = `Contract ${code} - Completed - ${counterParties}`;
      bodyVal = `Dear Requester,<br/>
      
      <br/>Your contract with <b> ${parties} </b>  has been reviewed and fully approved. <br/>
 
      <br/> Please upload the final contract using the below link.<br/>
 
      <br/> ${baseUrlLink}<br/>
 
      <br/> Thanks,<br/>
 
      <br/> Contract Approval System`;
    }

    if (type === "resubmit") {
      subject = `Contract ${code} - Resubmission - ${counterParties}`;
      bodyVal = `Dear Approver,<br/>
    
      <br/> You have been reassigned a contract with <b> ${parties} </b> which was rejected earlier.<br/>
 
      <br/> Please review the contract approval form to approve or reject. <br/>
 
      <br/>${baseUrlLink}<br/>
 
      <br/> Thanks,<br/>
 
      <br/> Contract Approval System`;
    }

    if (type === "rejected") {
      subject = `Contract ${code} - Rejected - ${counterParties}`;
      bodyVal = `Dear Requester,<br/>

      <br/> Your contract with <b> ${parties} </b> has been rejected with below reason. <br/>
 
      <br/> ${comments}  </br>
      
      <br/> Kindly resubmit with necessary details. <br/>
 
      <br/> ${baseUrlLink}<br/>
       
      <br/> Thanks,<br/>
 
      <br/> Contract Approval System`;
    }

    if (type === "esign-declined") {
      subject = `Contract ${code} - esign-declined - ${counterParties}`;
      bodyVal = `Dear Requester,<br/>

      <br/> Your Actual Contract with <b> ${parties} </b> Docusign E-signature has been rejected with below reason. <br/>
 
      <br/> ${comments}  </br>
      
      <br/> Kindly resubmit with necessary details. <br/>
 
      <br/> ${baseUrlLink}<br/>
       
      <br/> Thanks,<br/>
 
      <br/> Contract Approval System`;
    }

    return await this.emailService.sendEmailWithTemplate(
      userEmails,
      subject,
      bodyVal,
      createdBy,
    );
  }

  async sendContractRecallAssociateEmail(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    userEmails: any,
    code: string,
    type: string,
    parties: string,
    email: string,
    comments?: string,
  ): Promise<void> {
    const counterParties = parties && parties.length > 75
  ? parties.slice(0, 75)
  : parties;
    const subject = `Contract ${code} - recalled - ${counterParties}`;
    const bodyVal = `Dear Approver,<br/>
 
    <br/>You have been assigned NRL- <b> ${parties} </b> for your review and approval but it has been recalled by - <b> ${email} </b> <br/>
 
    <br/> Please ignore any previous emails regarding this form. You do not need to approve or reject it. <br/>

    <br/> The contract form has been recalled due to the following reason: - <b> ${comments} </b> <br/>
   
 
    <br/> Thanks,<br/>
 
    <br/> Contract Approval System`;

    return await this.emailService.sendEmailWithTemplate(
      userEmails,
      subject,
      bodyVal,
    );
  }
}
