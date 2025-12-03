import { createFileRoute } from '@tanstack/react-router'
import { ContractDetailPage } from '../../../../../pages/contracts/Detail';

type FormFilter = {
    page: string;
    moduleId: string;
};

export const Route = createFileRoute('/_app/finance/vendor-contract/requests/detail/$formId')({
    component: ContractDetailPage,
    validateSearch: (search: FormFilter) => {
        return {
            page: search.page,
            moduleId: search.moduleId
        };
    }
})