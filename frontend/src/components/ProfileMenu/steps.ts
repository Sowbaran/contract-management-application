import "./profile.css";

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

export const steps: Step[] = [
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
          "shepherd-button-primary bg-green-600 hover:bg-green-700 text-white green-hover-bg ",
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
        <div class="text-xl font-semibold py-2">Finance - Vendor Contract</div>
        <div class=" h-60  overflow-y-auto">
          <div class="mb-6">
            <div class="font-medium">How To raise a new request?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">Vendor Contract -> New Form</div>
          </div>

          <div class="mb-6">
            <div class="font-medium">How do I view requests created by myself?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">Vendor Contract -> Requests -> My Requests(tab)</div>
          </div>

          <div class="mb-6">
            <div class="font-medium">How do I view requests created by my team?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">Vendor Contract -> Requests -> Team Requests(tab)</div>
          </div>

          <div class="mb-6">
            <div class="font-medium">How do I view requests which are waiting for my approval?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">Vendor Contract -> Requests -> Approve Requests(tab)</div>
          </div>

          <div class="mb-6">
            <div class="font-medium">How do I Approve/Reject requests which are waiting for my approval?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">
              <ul class="list-disc pl-5">
                <li>Vendor Contract -> Requests -> Approve Requests(tab)</li>
                <li>Click on FormId (link)</li>
                <li>In Details Page -> Approve/Reject.</li>
              </ul>
            </div>
          </div>

          <div class="mb-6">
            <div class="font-medium">How do I Edit/Resubmit requests which are rejected by the approver?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">
              <ul class="list-disc pl-5">
                <li>Vendor Contract -> Requests -> My Requests(tab)</li>
                <li>Click on FormId (link)</li>
                <li>In Details Page -> Edit.</li>
                <li>Edit the details and click on submit.</li>
              </ul>
            </div>
          </div>

          <div class="mb-6">
            <div class="font-medium">How do I Download/Upload an MSA Document which is completely approved?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">
              <ul class="list-disc pl-5">
                <li>Vendor Contract -> Requests -> My Requests(tab)</li>
                <li>Click on FormId (link) which should be in completed status</li>
                <li>In Details Page -> Download/Upload.</li>
              </ul>
            </div>
          </div>

          <div class="mb-6">
            <div class="font-medium">How do I view current workflow configurations?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">Vendor Contract -> Configurations</div>
          </div>

          <div class="mb-6">
            <div class="font-medium">How do I update workflow configurations?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">Vendor Contract -> Configurations -> Update Workflow</div>
          </div>
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
    id: "people-and-culture",
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
          "shepherd-button-primary bg-green-600 hover:bg-green-700 text-white green-hover-bg ",
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
        <div class="text-xl font-semibold py-2">People And Culture - Head Count Request</div>
          <div class=" h-60  overflow-y-auto">
        <div class="mb-6">
          <div class="font-medium">How To raise a new request?</div>
          <div class="text-justify font-normal">To raise a new request select the options from the sidebar.</div>
          <div class="italic">Head Count Request -> New Form</div>
        </div>

        <div class="mb-6">
          <div class="font-medium">How do I view requests created by myself?</div>
          <div class="text-justify font-normal">Select the options from the sidebar.</div>
          <div class="italic">Head Count Request -> Requests -> My Requests(tab)</div>
        </div>

        <div class="mb-6">
          <div class="font-medium">How do I view requests created by my team?</div>
          <div class="text-justify font-normal">Select the options from the sidebar.</div>
          <div class="italic">Head Count Request -> Requests -> Team Requests(tab)</div>
        </div>

        <div class="mb-6">
          <div class="font-medium">How do I view requests which are waiting for my approval?</div>
          <div class="text-justify font-normal">Select the options from the sidebar.</div>
          <div class="italic">Head Count Request -> Requests -> Approve Requests(tab)</div>
        </div>

        <div class="mb-6">
          <div class="font-medium">How do I Approve/Reject requests which are waiting for my approval?</div>
          <div class="text-justify font-normal">Select the options from the sidebar.</div>
          <div class="italic">
            <ul class="list-disc pl-5">
              <li>Head Count Request -> Requests -> Approve Requests(tab)</li>
              <li>Click on FormId (link)</li>
              <li>In Details Page -> Approve/Reject.</li>
            </ul>
          </div>
        </div>

        <div class="mb-6">
          <div class="font-medium">How do I Edit/Resubmit requests which are rejected by the approver?</div>
          <div class="text-justify font-normal">Select the options from the sidebar.</div>
          <div class="italic">
            <ul class="list-disc pl-5">
              <li>Head Count Request -> Requests -> My Requests(tab)</li>
              <li>Click on FormId (link)</li>
              <li>In Details Page -> Edit.</li>
              <li>Edit the details and click on submit.</li>
            </ul>
          </div>
        </div>

        <div class="mb-6">
          <div class="font-medium">How do I view current workflow configurations?</div>
          <div class="text-justify font-normal">Select the options from the sidebar.</div>
          <div class="italic">Head Count Request -> Configurations</div>
        </div>

        <div class="mb-6">
          <div class="font-medium">How do I update workflow configurations?</div>
          <div class="text-justify font-normal">Select the options from the sidebar.</div>
          <div class="italic">Head Count Request -> Configurations -> Update Workflow</div>
        </div>
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
          "shepherd-button-primary bg-green-600 hover:bg-green-700 text-white green-hover-bg ",
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
        <div class="text-xl font-semibold py-2">Settings - User Management</div>
        <div class=" h-60  overflow-y-auto">
          <div class="mb-6">
            <div class="font-semibold">Users</div>
            <div class="font-medium">How To View Users and their role department mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Users</div>
          </div>
          <div class="mb-6">
            <div class="font-medium">How To Edit existing Users and their role department mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> User</div>
            <div class="italic">Click the Edit option to update the user details.</div>
          </div>
          <div class="mb-6">
            <div class="font-medium">How to Add New Users and their role department mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Users</div>
            <div class="italic">Click the Add User option to create new user with details.</div>
          </div>

          <div class="mb-6">
            <div class="font-semibold">Departments</div>
            <div class="font-medium">How To View Departments and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Departments</div>
          </div>
          <div class="mb-6">
            <div class="font-medium">How To Edit Existing Departments and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Departments</div>
            <div class="italic">Click the Edit option to update the department details.</div>
          </div>
          <div class="mb-6">
            <div class="font-medium">How to Add New Department and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Departments</div>
            <div class="italic">Click the Add Department option to create a new department with details.</div>
          </div>

          <div class="mb-6">
            <div class="font-semibold">Roles</div>
            <div class="font-medium">How To View Roles and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Roles</div>
          </div>
          <div class="mb-6">
            <div class="font-medium">How To Edit Existing Roles and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Roles</div>
            <div class="italic">Click the Edit option to update the role details.</div>
          </div>
          <div class="mb-6">
            <div class="font-medium">How to Add New Department and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Roles</div>
            <div class="italic">Click the Add Role option to create a new role details.</div>
          </div>

          <div class="mb-6">
            <div class="font-semibold">Permissions</div>
            <div class="font-medium">How To View Permissions and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Permissions</div>
          </div>
          <div class="mb-6">
            <div class="font-medium">How To Edit Existing Permissions and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Permissions</div>
            <div class="italic">Click the Edit option to update the permission details.</div>
          </div>
          <div class="mb-6">
            <div class="font-medium">How to Add New Permissions and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Permissions</div>
            <div class="italic">Click the Add Permission option to create a new permission with details.</div>
          </div>

          <div class="mb-6">
            <div class="font-semibold">Modules</div>
            <div class="font-medium">How To View Modules and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Modules</div>
          </div>
          <div class="mb-6">
            <div class="font-medium">How To Edit Existing Modules and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Modules</div>
            <div class="italic">Click the Edit option to update the module details.</div>
          </div>
          <div class="mb-6">
            <div class="font-medium">How to Add New Department and their mappings?</div>
            <div class="text-justify font-normal">Select the options from the sidebar.</div>
            <div class="italic">User Management -> Modules</div>
            <div class="italic">Click the Add Module option to create a new module with details.</div>
          </div>

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
        classes: "shepherd-button-primary bg-green-600 hover:bg-green-700 text-white green-hover-bg",
        text: "Back",
        type: "back",
      },
      {
        classes: "shepherd-button-primary bg-green-600 hover:bg-green-700 text-white green-hover-bg",
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
      enabled: false
    }
  },
];
