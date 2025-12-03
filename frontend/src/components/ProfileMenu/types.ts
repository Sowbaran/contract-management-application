export type ProfileMenuProps = {
  userName: string | null | undefined;
  handleShow: () => void;
  handleKeyPress: (
    event:
      | React.KeyboardEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => void;
  handleLogoutPopup: () => void;
};
