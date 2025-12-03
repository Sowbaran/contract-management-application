import { Alert } from '@ui-components';
import { AlertProps } from '@ui-componentsAlert/types';
import ReactDOM from 'react-dom';

export const AlertLayout = ({...props} : AlertProps) => {
    const portalRoot = document.getElementById('portal-root');

    if (!portalRoot) {
      console.error('Portal root element not found!');
      return null;
    }

  return ReactDOM.createPortal(
    <Alert {...props} />,
    portalRoot
  );
};
