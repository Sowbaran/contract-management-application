import "./Step.css";

interface Step {
  id: string;
  beforeShowPromise: () => Promise<void>;
  buttons: { classes: string; text: string; type: string }[];
  highlightClass: string;
  scrollTo: boolean;
  cancelIcon: { enabled: boolean };
  title: string;
  text: string[];
  when: { show: () => void; hide: () => void };
}

export const Steps: Step[] = [
  {
    id: "finance",
    beforeShowPromise: () => Promise.resolve(),
    buttons: [
      {
        classes:
          "shepherd-button-secondary bg-red-600 hover:bg-gray-500 text-white red-hover-bg ",
        text: "Exit",
        type: "cancel",
      },
      {
        classes:
          "shepherd-button-primary bg-[#632b50] hover:bg-[#632b50] text-white green-hover-bg ",
        text: "Next",
        type: "next",
      },
    ],
    highlightClass: "highlight",
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    title: "<b>Welcome to SST Internal Forms</b>",
    text: [
      `<div class="max-w-screen-lg mx-auto">
        <div class="text-xl font-bold py-2">Contract Approval</div>
        <div class=" h-60  overflow-y-auto">

        <section>
        <h3 class="text-lg font-semibold">New Form:</h3>
        <ul class="list-disc ml-5 space-y-2 mt-2 text-sm sm:text-base">
          <li>
            <strong>Create New Request</strong><br />
            Go to: Contract Approval → My Requests → Click New Form
          </li>
          <li>
            <strong>Draft Option:</strong> Add a “Draft” option for the form, which works without any validation.
          </li>
        </ul>
      </section>

      <!-- Workflow Fields -->
      <section>
        <h3 class="text-lg font-semibold">
          New Form Fields That Influence Workflow:
        </h3>
        <ul class="list-disc ml-5 space-y-2 mt-2 text-sm sm:text-base">
          <li><strong>First Reviewer</strong> (optional)</li>
          <li>
            <strong>Type of Approval Being Sought:</strong>
            <ul class="list-disc ml-6 mt-1 space-y-1">
              <li>
                Deed of Novation – just goes to Legal & CFO regardless of the amount.
              </li>
              <li>
                Expenditure no contract for signing – skip the final approver e-sign.
              </li>
            </ul>
          </li>
          <li>
            <strong>Tech Involvement:</strong><br />
            Does this contract involve any third-party software or questions to determine if it needs tech review? If No, bypass the tech workflow.
          </li>
          <li><strong>Monetary Value (in AUD):</strong> decides the workflow.</li>
        </ul>
      </section>

      <!-- My Requests -->
      <section>
        <h3 class="text-lg font-semibold">My Requests:</h3>
        <ul class="list-disc ml-5 space-y-2 mt-2 text-sm sm:text-base">
          <li>
            <strong>Recall Request</strong>
            <ul class="list-disc ml-6 mt-1 space-y-1">
              <li>Recall buttons appear only at the first approval level.</li>
              <li>On clicking, status changes from Pending → Draft.</li>
              <li>
                Recall reason is mandatory, saved in form history, and added to
                the notification email.
              </li>
            </ul>
          </li>
          <li>
            <strong>Delete Request</strong>
            <ul class="list-disc ml-6 mt-1 space-y-1">
              <li>Allowed only if the form status is Draft or Rejected.</li>
              <li><strong>Draft</strong> → Hard delete.</li>
              <li><strong>Rejected</strong> → Soft delete (reason stored).</li>
            </ul>
          </li>
          <li>
            <strong>Edit/Resubmit a Rejected Request</strong><br />
            Go to: My Requests → Click on Form ID → Edit the form → Submit
          </li>
          <li>
            <strong>Download/Upload MSA Document (Post Approval)</strong><br />
            Go to: My Requests → Click on Form ID with Completed status → Use the
            Download/Upload section on the form page
          </li>
        </ul>
      </section>

      <!-- Team Requests -->
      <section>
        <h3 class="text-lg font-semibold">Team Requests:</h3>
        <ul class="list-disc ml-5 space-y-2 mt-2 text-sm sm:text-base">
          <li>Go to: Contract Approval → Requests → Team Requests</li>
          <li>Super Admin and Finance Admin can view all department forms.</li>
          <li>Other users can only see forms from their own department.</li>
        </ul>
      </section>


        </div>
      </div>`,
    ],
    when: {
      show: () => {
        console.log("show step");
      },
      hide: () => {
        console.log("hide step");
      },
    },
  },
  {
    id: "finance",
    beforeShowPromise: () => Promise.resolve(),
    buttons: [
      {
        classes:
          "shepherd-button-secondary bg-red-600 hover:bg-gray-500 text-white red-hover-bg ",
        text: "Exit",
        type: "cancel",
      },
      {
        classes:
          "shepherd-button-primary bg-green-600 hover:bg-green-700 text-white green-hover-bg",
        text: "Back",
        type: "back",
      },
      {
        classes:
          "shepherd-button-primary bg-[#632b50] hover:bg-[#632b50] text-white green-hover-bg ",
        text: "Next",
        type: "next",
      },
    ],
    highlightClass: "highlight",
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    title: "<b>Welcome to SST Internal Forms</b>",
    text: [
      `<div class="max-w-screen-lg mx-auto">
        <div class="text-xl font-bold py-2">Contract Approval</div>
        <div class=" h-60  overflow-y-auto">

        <!-- Approve Requests -->
    <h3 class="font-semibold text-lg">Approve Requests:</h3>

    <ul class="list-disc mt-2 list-inside space-y-2 ml-4">
      <strong>View & Take Action</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Contract Approval → Requests → Approve Requests</li>
          <li>Click on Form ID → View form details → Click Approve or Reject</li>
        </ul>
    </ul>

    <!-- E-sign Requests -->
    <h3 class="font-semibold text-lg mt-2">E-sign Requests:</h3>
    <ul class="list-disc list-inside mt-2 space-y-2 ml-4">
        <strong>Access E-signing Contracts</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Contract Approval → Requests → E-sign Requests</li>
          <li>Visible to signatories and Super Admins</li>
        </ul>
        <strong>Actions</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li><strong>Restart:</strong> Super Admins can reset the form status.</li>
          <li><strong>Resend DocuSign Email:</strong> Available to Super Admins and workflow users.</li>
        </ul>
    </ul>

    <!-- My Approved List -->
    <h3 class="font-semibold text-lg mt-2">My Approved List:</h3>
    <ul class="list-disc list-inside space-y-1 ml-5">
      <li>Go to: Contract Approval → Requests → My Approved List</li>
      <li>Shows forms where your email was part of the approval at any stage.</li>
      <li>View-only – No actions like Edit, Approve, Reject, or Delete.</li>
    </ul>

    <!-- Workflow Configuration -->
    <h3 class="mt-2 font-semibold text-lg">Workflow Configuration:</h3>
    <ul class="list-disc list-inside space-y-1 ml-5">
      <li><strong>View:</strong> Contract Approval → Configurations</li>
      <li><strong>Update:</strong> Contract Approval → Configurations → Update Workflow</li>
    </ul>

    <!-- Workflow Logic -->
    <h3 class="font-semibold text-lg mt-2">Workflow Logic:</h3>
    <ul class="list-disc list-inside space-y-2 mt-2 ml-5">
      <strong>Workflow Decision Based on Form Fields</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li><strong>Monetary Value ≥ Minimum</strong> → Include role in workflow</li>
          <li><strong>Monetary Value &lt; Minimum</strong> → Exclude role</li>
          <li><strong>Deed of Novation</strong> → Fixed workflow; ignores monetary value</li>
          <li><strong>Bypass Workflow</strong> → Skips levels if flag is set</li>
          <li><strong>Include on Requester Check</strong> → If requester’s role is flagged, exclude from workflow</li>
          <li><strong>Is Specific Department Approver</strong> → Include role only if it matches the selected department.</li>
        </ul>
    </ul>

    <!-- Final Approver & E-sign Logic -->
    <h3 class="font-semibold text-lg mt-2">Final Approver & E-sign Logic:</h3>
    <ul class="list-disc list-inside space-y-2 mt-2 ml-5">
      <strong>If Expenditure – No contract for signing is selected:</strong>
        <ul class="list-disc list-inside ml-5">
          <li>→ Skip e-sign → Set status to Fulfilled</li>
        </ul>
      <strong class="mt-1">For other types:</strong>
        <ul class="list-disc list-inside ml-5">
          <li>Ask: “Would you like to e-sign this request now?”</li>
          <li>If No:
            <ul class="list-disc list-inside ml-5">
              <li>→ Skip DocuSign → Mark as Completed</li>
            </ul>
          </li>
          <li>If Yes:
            <ul class="list-disc list-inside ml-5">
              <li>Ask: “Would you like to add witness details?”</li>
              <li>If Yes: Ask for witness name and email → DocuSign with witness</li>
              <li>If No: Proceed with single e-sign flow</li>
            </ul>
          </li>
        </ul>
    </ul>

        </div>
      </div>`,
    ],
    when: {
      show: () => {
        console.log("show step");
      },
      hide: () => {
        console.log("hide step");
      },
    },
  },
  {
    id: "settings",
    beforeShowPromise: () => Promise.resolve(),
    buttons: [
      {
        classes:
          "shepherd-button-secondary bg-red-600 hover:bg-gray-500 text-white red-hover-bg ",
        text: "Exit",
        type: "cancel",
      },
      {
        classes:
          "shepherd-button-primary bg-green-600 hover:bg-green-700 text-white green-hover-bg",
        text: "Back",
        type: "back",
      },
      {
        classes:
          "shepherd-button-primary bg-[#632b50] hover:bg-[#632b50] text-white green-hover-bg ",
        text: "Next",
        type: "next",
      },
    ],
    highlightClass: "highlight",
    scrollTo: false,
    cancelIcon: {
      enabled: true,
    },
    title: "<b>Welcome to SST Internal Forms</b>",
    text: [
      `<div class="max-w-screen-lg mx-auto">
        <div class="text-xl font-semibold py-2">Settings - User, Role, Department, and Permission Management - Super Admin only</div>
        <div class=" h-60  overflow-y-auto">

          <!-- Users -->
    <h3 class="mt-2 font-semibold text-base">Users</h3>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li><strong>View Users and Their Role-Department Mappings</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Settings → Users</li>
        </ul>
      </li>
      <li><strong>Edit Existing Users</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Settings → Users → Click the Edit icon to update user details and role-department mappings.</li>
        </ul>
      </li>
      <li><strong>Add New User</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Settings → Users → Click Add User to create a new user and assign roles and departments.</li>
          <li><strong>Note:</strong> To assign roles like Super Admin, Vendor Module Admin, CEO, CFO, choose the department: chief-department. For other users, directly select the appropriate role’s department.</li>
        </ul>
      </li>
    </ul>

    <!-- Departments -->
    <h3 class="mt-2 font-semibold text-base">Departments</h3>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li><strong>View Departments and Mappings</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Settings → Departments</li>
        </ul>
      </li>
      <li><strong>Edit Existing Departments</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Settings → Departments → Click Edit to modify department details and mappings.</li>
        </ul>
      </li>
      <li><strong>Add New Department</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Settings → Departments → Click Add Department to create a new department.</li>
        </ul>
      </li>
    </ul>

    <!-- Roles -->
    <h3 class="mt-2 font-semibold text-base">Roles</h3>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li><strong>View Roles and Mappings</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Settings → Roles</li>
        </ul>
      </li>
      <li><strong>Edit Existing Roles</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Settings → Roles → Click Edit to update role details.</li>
        </ul>
      </li>
      <li><strong>Add New Role</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Settings → Roles → Click Add Role to create a new role.</li>
        </ul>
      </li>
    </ul>

    <!-- Permissions -->
    <h3 class="mt-2 font-semibold text-base">Permissions</h3>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li><strong>View Permissions and Mappings</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Settings → Permissions</li>
        </ul>
      </li>
    </ul>

    <!-- Modules -->
    <h3 class="mt-2 font-semibold text-base">Modules</h3>
    <ul class="list-disc list-inside space-y-2 ml-4">
      <li><strong>View Modules and Mappings</strong>
        <ul class="list-disc list-inside ml-5 space-y-1">
          <li>Go to: Settings → Modules</li>
        </ul>
      </li>
    </ul>

          </div>
      </div>`,
    ],
    when: {
      show: () => {
        console.log("show step");
      },
      hide: () => {
        console.log("hide step");
      },
    },
  },
  {
    id: "done",
    beforeShowPromise: () => Promise.resolve(),
    buttons: [
      {
        classes:
          "shepherd-button-primary bg-green-600 hover:bg-green-700 text-white green-hover-bg",
        text: "Back",
        type: "back",
      },
      {
        classes:
          "shepherd-button-primary bg-[#632b50] hover:bg-[#632b50] text-white green-hover-bg",
        text: "Done",
        type: "next",
      },
    ],
    title: "Done. You have mastered the walkthrough!",
    text: [],
    when: {
      show: () => console.log("show step"),
      hide: () => console.log("hide step"),
    },
    highlightClass: "",
    scrollTo: false,
    cancelIcon: {
      enabled: false,
    },
  },
];
