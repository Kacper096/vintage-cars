import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { IModel } from "../../../core/models/base/IModel";
import { ErrorDetails } from "../../../core/models/errors/ErrorDetail";
import Paged from "../../../core/models/paged/Paged";
import PagedList from "../../../core/models/paged/PagedList";
import UrlHelper from "../../../core/models/utils/UrlHelper";
import BaseWebApiService from "../../../core/services/api-service/BaseWebApiService";
import { toCallback } from "../../../core/services/api-service/Callback";

const useAuhtorizedPagedList = <T extends IModel>(url: string, onError?: (message: string) => void): 
    [Dispatch<SetStateAction<Paged>>, (paged: Paged, additionalParameters: any) => void, boolean, PagedList<T>, () => Promise<void>] => {
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(new PagedList<T>());
    const [paged, setPaged] = useState<Paged>(null);
    const apiService = new BaseWebApiService();
    const parameters = useRef(null);

    const callback = useCallback((data: PagedList<T>) => {
        setResponse(prevState => {
            const list = new Array<T>();
            if(prevState.source.length > 0)
                list.push(...prevState.source);
            list.push(...data.source);
            let map = new Map();
            prevState.source = list.filter(el => {
                const val = map.get(el.id);
                if(val) {
                    if(el.id === val) {
                        map.delete(el.id);
                        map.set(el.id, el);
                        return true;
                    } else 
                        return false;
                }
                map.set(el.id, el);
                return true;
            });
            prevState.hasNextPage = data.hasNextPage;
            prevState.hasPreviousPage = data.hasPreviousPage;
            prevState.totalCount = data.totalCount;
            prevState.totalPages = data.totalPages;
            prevState.pageIndex = data.pageIndex;
            prevState.pageSize =  data.pageSize;
            return prevState;
        })
    }, [response.source])

    async function getData() {
        setIsLoading(true);
        if(parameters.current === null || parameters.current === undefined) 
            parameters.current = {};
        parameters.current.pageIndex = paged.pageIndex;
        parameters.current.pageSize = paged.pageSize;

        await apiService.getAuthorized<PagedList<T>>(UrlHelper.generateParameters(url, parameters.current), toCallback(
            (data) => callback(data),
            (validError) => handleError(validError),
            (error) => handleError(error)
        ));
        setIsLoading(false);
    }
    const handleError = (error: ErrorDetails) => {
        if(onError) {
            onError(error?.message);
        }
    }
    
    const refresh = () => {
        setResponse(new PagedList<T>());
        return getData();
    }

    const setPagedWithAdditionalParameter = (paged: Paged, additionalParameters: any = null) => {
        parameters.current = additionalParameters;
        setPaged(paged)
    }

    useEffect(() => {
        if(paged === null) return;
        getData();
    }, [paged]);

    return [setPaged, setPagedWithAdditionalParameter,isLoading, response, refresh];
}
export default useAuhtorizedPagedList;