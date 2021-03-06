import { Box, Button, Container, Divider, TextField, CircularProgress, Backdrop, } from "@material-ui/core";
import { Guid } from "guid-typescript";
import { createRef, Dispatch, SetStateAction, useEffect, useState } from "react";
import Paged from "../../../core/models/paged/Paged";
import { isEmpty } from "../../../core/models/utils/ObjectExtension";
import { isStringNullOrEmpty } from "../../../core/models/utils/StringExtension";
import useExtractData from "../../../hooks/data/ExtracttDataHook";
import useGetData from "../../../hooks/fetch/GetDataHook";
import useInfinitePagedListAPI from "../../../hooks/fetch/pagedAPI/InfinitePagedAPIHook";
import useSendSubmitWithNotification from "../../../hooks/fetch/SendSubmitHook";
import useLoading from "../../../hooks/utils/LoadingHook";
import SimpleInfiniteSelect from "../../base/select/simple-infinite-select/SimpleInfiniteSelectComponent";
import { ValidatorManager, ValidatorType } from "../../../core/models/shared/Validator";
import ContactProfile from "../models/ContactProfile";
import CountryView from "../models/CountryView";
import StateProvinceView from "../models/StateProvinceView";
import { profileSectionStyle } from "./profile-section-style";
import useLocale from "../../../hooks/utils/LocaleHook";

const ProfileSection = (props) => {
    const {showLoading, hideLoading} = props;
    const loc = useLocale('common', ['profile', 'profile-section', 'form'])
    const classes = profileSectionStyle();
     /*profile section errors*/
     const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        postalCode: "",
    });

    const profileSectionValidatorManager = new ValidatorManager();
    profileSectionValidatorManager.setValidators({
        ["firstName"]: [{
            type: ValidatorType.NotEmpty,
            paramValue: null,
            message: loc.transModel<ContactProfile>("firstName", ['validators', 'label']),
            isValid: true
        }],
        ["lastName"]: [{
            type: ValidatorType.NotEmpty,
            paramValue: null,
            message: loc.transModel<ContactProfile>("lastName", ['validators', 'label']),
            isValid: true
        }],
        ["phoneNumber"]: [{
            type: ValidatorType.NotEmpty,
            paramValue: null,
            message: loc.transModel<ContactProfile>("phoneNumber", ['validators', 'label']),
            isValid: true,
        }],
        ["zipPostalCode"]: [{
            type: ValidatorType.ZipCode,
            paramValue: null,
            message: loc.transModel<ContactProfile>("zipPostalCode", ['validators', 'label']),
            isValid:  true,
        }]
    });
    const [receivedModel, isLoading] = useGetData<ContactProfile>("/v1/account/details");
    const [injectData, model, extractData, extractDataFromDerivedValue] = useExtractData<ContactProfile>(isEmpty(receivedModel) ? new ContactProfile() : receivedModel);
    const [send] = useSendSubmitWithNotification("/v1/account/details", showLoading, hideLoading)
    const [countryId, setCountryId] = useState(Guid.createEmpty());
    const [fetchCountry, isLoadingCountry, responseCountry] = useInfinitePagedListAPI<CountryView>("/v1/country/all");
    const [fetchStateProvince, isLoadingStateProvince, responseStateProvince] = useInfinitePagedListAPI<StateProvinceView>(`/v1/country/state-province/all/${countryId}`);
    const handleSubmit = async (event) => {
        event.preventDefault();
        profileSectionValidatorManager.isValid(model);
        setErrors({...errors,
             firstName: profileSectionValidatorManager.getMessageByKey("firstName"), 
             lastName: profileSectionValidatorManager.getMessageByKey("lastName"),
            phoneNumber: profileSectionValidatorManager.getMessageByKey("phoneNumber"),
            postalCode: profileSectionValidatorManager.getMessageByKey("zipPostalCode"),
        });
        if(profileSectionValidatorManager.isAllValid())
            await send(model);
    }

    useEffect(() => {
        injectData(receivedModel);
    }, [receivedModel]);
    
    useLoading([isLoading], showLoading, hideLoading);
    return (
        <Box>
            <form className={classes.form} noValidate method="POST" onSubmit={handleSubmit}>
                <TextField
                InputLabelProps={{shrink: !isStringNullOrEmpty(model?.firstName)}}
                error={!!errors.firstName}
                helperText={errors.firstName}
                value={model?.firstName}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="firstName"
                label={loc.transModel<ContactProfile>('firstName', 'label')}
                name="firstName"
                autoComplete="firstName"
                onChange={(firstName) => extractData("firstName", firstName)}/>
                <TextField
                InputLabelProps={{shrink: !isStringNullOrEmpty(model?.lastName)}}
                error={!!errors.lastName}
                helperText={errors.lastName}
                value={model?.lastName}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="lastName"
                label={loc.transModel<ContactProfile>('lastName', 'label')}
                name="lastName"
                autoComplete="lastName" 
                onChange={(lastName) => extractData("lastName", lastName)}/>
                <TextField
                InputLabelProps={{shrink: !isStringNullOrEmpty(model?.phoneNumber)}}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber}
                value={model?.phoneNumber}
                variant="outlined"
                margin="normal"
                fullWidth
                required
                id="phoneNumber"
                label={loc.transModel<ContactProfile>('phoneNumber', 'label')}
                name="phoneNumber"
                autoComplete="phoneNumber" 
                onChange={(phoneNumber) => extractData("phoneNumber", phoneNumber)}/>
                <TextField
                InputLabelProps={{shrink: !isStringNullOrEmpty(model?.company)}}
                value={model?.company}
                variant="outlined"
                margin="normal"
                fullWidth
                id="company"
                label={loc.transModel<ContactProfile>('company', 'label')}
                name="company"
                autoComplete="company"
                onChange={(company) => extractData("company", company)} />
                <SimpleInfiniteSelect
                    id="country"
                    label={loc.trans(["country", 'label'])}
                    maxHeight="200px"
                    fullWidth={true}
                    pageSize={10}
                    value={model?.countryId}
                    isLoading={isLoadingCountry}
                    fetchData={fetchCountry}
                    data={responseCountry?.source}
                    onChangeValue={(value) => { 
                        setCountryId(value);
                        extractDataFromDerivedValue("countryId", value);
                        fetchStateProvince(new Paged(0, 10));
                    }}
                    totalCount={responseCountry?.totalCount}
                /> 
                <SimpleInfiniteSelect
                    id="state-province"
                    label={loc.trans(["state-province", 'label'])}
                    maxHeight="200px"
                    disabled={countryId?.toString() === Guid.EMPTY}
                    fullWidth={true}
                    pageSize={10}
                    value={model?.stateProvinceId}
                    isLoading={isLoadingStateProvince}
                    fetchData={fetchStateProvince}
                    data={responseStateProvince?.source}
                    onChangeValue={(value) => extractDataFromDerivedValue("stateProvinceId", value)}
                    totalCount={responseStateProvince?.totalCount}
                />
                <TextField
                InputLabelProps={{shrink: !isStringNullOrEmpty(model?.city)}}
                value={model?.city}
                variant="outlined"
                margin="normal"
                fullWidth
                id="city"
                label={loc.transModel<ContactProfile>("city", 'label')}
                name="city"
                autoComplete="city"
                onChange={(city) => extractData("city", city)} />
                <TextField
                InputLabelProps={{shrink: !isStringNullOrEmpty(model?.address1)}}
                value={model?.address1}
                variant="outlined"
                margin="normal"
                fullWidth
                id="address"
                label={loc.transModel<ContactProfile>("address1", 'label')}
                name="address"
                autoComplete="address"
                onChange={(address) => extractData("address1", address)} />
                <TextField
                InputLabelProps={{shrink: !isStringNullOrEmpty(model?.zipPostalCode)}}
                error={!!errors.postalCode}
                helperText={errors.postalCode}
                value={model?.zipPostalCode}
                variant="outlined"
                margin="normal"
                fullWidth
                id="postalCode"
                label={loc.transModel<ContactProfile>("zipPostalCode", 'label')}
                name="postalCode"
                autoComplete="postalCode"
                onChange={(postalCode) => extractData("zipPostalCode", postalCode)} />
                <Box sx={{padding: 5}}></Box>
                <Box sx={{
                    display: 'flex',
                    position: 'relative',
                    justifyContent: 'flex-end',
                    width: '100%',
                }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary">
                            {loc.trans(['buttons', 'submit', 'caption'])}
                    </Button>
                </Box>
            </form>
        </Box>
    )
}

export default ProfileSection;