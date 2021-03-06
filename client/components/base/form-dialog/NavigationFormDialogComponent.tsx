import { Box, Button, Container, CssBaseline, Dialog, DialogActions, DialogContent, DialogProps, Tab, Tabs } from "@material-ui/core"
import { useStyles } from "./navigation-form-dialog-style"
import TabPanel from "./tab-panel/TabPanelComponent"
import React from "react";
import { DialogTitle } from "./dialog-title/DialogTitleComponent";
import { IconWithContent } from "../../../core/models/base/IconWithContent";

export interface NavigationFormDialogProps {
    title: string,
    titleIsDynamic: boolean
    iconsWithContent: Array<IconWithContent>,
    open: boolean,
    onClose: () => void,
}
export const NavigationFormDialog = (props: NavigationFormDialogProps) => {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const [title, setTitle] = React.useState(!props.titleIsDynamic ? props.title : props.iconsWithContent[0].title);
    const {iconsWithContent} = props;
    /*HANDLERS*/
    const handleChange = (event, newValue) => {
        setValue(newValue);

        if(props.titleIsDynamic) 
        {
            setTitle(props.iconsWithContent[newValue].title);
        }
    }

    return (
        <div className={classes.root}>
            <Dialog open={props.open} fullWidth={true} maxWidth="md">
                <DialogTitle id={"navigation-form-dialog"} onClose={props.onClose}>{title}</DialogTitle>
                <DialogContent dividers className={classes.dialogContent}>
                        <Tabs
                            value={value}
                            variant="scrollable"
                            orientation="vertical"
                            onChange={handleChange}
                            indicatorColor="primary"
                            textColor="secondary"
                            aria-label="icon label tabs"
                            className={classes.tabs}>
                            {props.iconsWithContent.map((icon, index) => (
                                <Tab icon={icon.icon} key={`${icon.title}-${index}`} className={classes.tab} />
                            ))}
                        </Tabs> 
                        {iconsWithContent.map((icWithCont, index) => (
                            <TabPanel value={value} index={index} key={`Panel-${icWithCont.title}-${index}`}>
                                {icWithCont.content}
                            </TabPanel>
                        ))}
                </DialogContent>
                <DialogTitle id={"navigation-form-dialog-footer"}>{""}</DialogTitle>
            </Dialog>
        </div>
    )
}