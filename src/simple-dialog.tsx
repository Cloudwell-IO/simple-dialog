import * as React from 'react';
import { DefaultButton, Dialog, DialogType, IButtonProps, IButtonStyles, IDialogContentProps, IDialogProps, IMessageBarStyles, IModalProps, ITextFieldProps, Label, MessageBar, MessageBarType, PrimaryButton, Stack, StackItem, TextField } from '@fluentui/react';

/**
 * @summary Defines the base properties for other dialog property interfaces.
 */
interface IBaseDialogProps {
    /**
     * @summary The title of the dialog.
     */
    title?: string;
    /**
     * @summary The content of the dialog.
     */
    message: string | JSX.Element;
    /**
     * @summary The properties of the dialog to pass to the dialog.
     */
     dialogProps?: Partial<IDialogProps>;
    /**
     * @summary The properties of the dialog content to pass to the dialog.
     */
     dialogContentProps?: IDialogContentProps;
     /**
      * @summary The properties of the modal to pass to the dialog.
      */
      modalProps?: IModalProps;
}

/**
 * @summary Defines the properties of the SimpleDialog.
 */
export interface ISimpleDialogProps extends IBaseDialogProps {
    /**
     * @summary The buttons to show in the dialog footer.
     */
    buttons: ISimpleDialogButtonProps[];
}

/**
 * @summary The types of buttons supported by the simple dialog.
 */
export enum SimpleDialogButtonType {
    /**
     * @summary Indicates that a Fluent UI PrimaryButton will be used.
     */
    Primary,
    /**
     * @summary Indicates that a Fluent UI DefaultButton will be used.
     */
    Default
}

/**
 * @summary Defines the state of the SimpleDialog.
 */
interface ISimpleDialogState {
    /**
     * @summary The messages to display in the simple dialog.
     */
    messages: ISimpleDialogMessageProps[];
}

/**
 * @summary Defines the properties of a message for the simple dialog.
 */
interface ISimpleDialogMessageProps {
    /**
     * @summary The type of message.
     */
    type: MessageBarType;
    /**
     * @summary The text of the message.
     */
    text: string;
    /**
     * @summary The styles of the message bar.
     */
    styles?: IMessageBarStyles;
}

/**
 * @summary Defines the properties of a button for the simple dialog.
 */
export interface ISimpleDialogButtonProps {
    /**
     * @summary The type of button.
     */
    type: SimpleDialogButtonType;
    /**
     * @summary The button text.
     */
    text: string;
    /**
     * @summary The button styles.
     */
    styles?: IButtonStyles;
    /**
     * @summary A function to call when the button is clicked.
     */
    onClick?: CallableFunction;
    /**
     * @summary The link to navigate to.
     */
    href?: string;
    /**
     * @summary The frame to target.
     */
    target?: "_blank" | "_self" | "_parent" | "_top" | string;
}

/**
 * @summary An abstraction of the Fluent UI Dialog that only requires a title, message and buttons.
 */
export class SimpleDialog extends React.Component<ISimpleDialogProps, ISimpleDialogState> {
    constructor(props: ISimpleDialogProps) {
        super(props);
        this.state = {
            messages: []
        }
    }

    private _onButtonClicked = (button: ISimpleDialogButtonProps, event: any) => {
        var buttonResult = typeof button.onClick === "function" && button.onClick(event);
        if (buttonResult) {
            this.setState({ messages: [...this.state.messages, buttonResult] });
        }
    };

    private _onMessageDismissed = (message: ISimpleDialogMessageProps) => {
        this.setState({ messages: this.state.messages.filter(m => m !== message) });
    };

    public render() {
        const { title, message, buttons, dialogProps, dialogContentProps, modalProps } = this.props;
        return (<>
            <Dialog
                {...dialogProps}
                hidden={false}
                dialogContentProps={{
                    type: DialogType.normal,
                    showCloseButton: false,
                    ...dialogContentProps,
                    title: title || ''
                }}
                modalProps={{
                    isBlocking: true,
                    styles: { main: { minWidth: 450, maxWidth: 450 } },
                    ...modalProps
                }} >
                <Stack tokens={{ childrenGap: 20 }}>
                    <StackItem>{message}</StackItem>
                    {this.state.messages.length > 0 && <>
                        {this.state.messages.map(m => (<StackItem>
                            <MessageBar styles={m.styles} messageBarType={m.type} onDismiss={() => { this._onMessageDismissed(m); }}>{m.text}</MessageBar>
                        </StackItem>))}
                    </>}
                    <StackItem>
                        <Stack horizontalAlign="end" horizontal tokens={{ childrenGap: 10 }}>
                            {buttons.map(b => {
                                let button = undefined;
                                if (b.onClick || b.href) {
                                    const buttonProps: IButtonProps = { text: b.text, href: b.href, target: b.target, styles: b.styles };
                                    if (b.onClick) {
                                        buttonProps.onClick = (event) => { this._onButtonClicked(b, event); };
                                    }
                                    switch (b.type) {
                                        case SimpleDialogButtonType.Primary: {
                                            button = <PrimaryButton {...buttonProps} />;
                                            break;
                                        }
                                        case SimpleDialogButtonType.Default: {
                                            button = <DefaultButton {...buttonProps} />;
                                            break;
                                        }
                                    }
                                }
                                return button;
                            })}
                        </Stack>
                    </StackItem>
                </Stack>
            </Dialog>
        </>);
    }
}

/**
 * @summary Defines the properies for the AlertDialog.
 */
export interface IAlertDialogProps extends IBaseDialogProps {
    /**
     * @summary The optional text to show on the dialog button.
     * @description Default value is "Okay"
     */
    buttonText?: string;
    /**
     * @summary Function that is called when the alert is acknowledged.
     */
    onClose: () => void;
}

/**
 * @summary A SimpleDialog wrapper that uses the specified title, message, onClose, and a single button with the specified buttonText or "Okay" if buttonText is not provided
 */
export class AlertDialog extends React.Component<IAlertDialogProps, any> {
    public render() {
        const { title, message, onClose, buttonText } = this.props;
        return <SimpleDialog title={title} message={message} buttons={[
            {
                text: buttonText || "Okay",
                type: SimpleDialogButtonType.Primary,
                onClick: onClose
            }
        ]} />
    }
}

/**
 * @summary Defines the properies for the ConfirmDialog.
 */
export interface IConfirmDialogProps extends IBaseDialogProps {
    /**
     * @summary The optional text to show on the confirm dialog button.
     * @description Default value is "Yes"
     */
    confirmButtonText?: string;
    /**
     * @summary The optional text to show on the reject dialog button.
     * @description Default value is "No"
     */
    rejectButtonText?: string;
    /**
     * @summary Function that is called when the confirmation is acknowledged.
     * @param result True if the confirm button was clicked. False if the reject button was clicked.
     */
    onClose: (result: boolean) => void;
}

/**
 * @summary A SimpleDialog wrapper that uses the specified title, message, onClose,
 * a reject button with the specified rejectButtonText or "Yes" if rejectButtonText is not provided,
 * and a confirm button with the specified confirmButtonText or "Yes" if confirmButtonText is not provided
 */
export class ConfirmDialog extends React.Component<IConfirmDialogProps, any> {
    /**
     * @summary Called when the confirm button is clicked.
     */
    private onConfirm = () => {
        this.props.onClose(true);
    };
    /**
     * @summary Called when the reject button is clicked.
     */
    private onReject = () => {
        this.props.onClose(false);
    };
    public render() {
        const { confirmButtonText, rejectButtonText, title, message } = this.props;
        return <SimpleDialog title={title} message={message} buttons={[
            {
                text: rejectButtonText || "No",
                type: SimpleDialogButtonType.Default,
                onClick: this.onReject
            },
            {
                text: confirmButtonText || "Yes",
                type: SimpleDialogButtonType.Primary,
                onClick: this.onConfirm
            }
        ]} />
    }
}

/**
 * @summary Defines the properies for the PromptDialog.
 */
export interface IPromptDialogProps extends IBaseDialogProps {
    /**
     * @summary The optional text to show on the confirm dialog button.
     * @description Default value is "Yes"
     */
    confirmButtonText?: string;
    /**
     * @summary The optional text to show on the reject dialog button.
     * @description Default value is "No"
     */
    rejectButtonText?: string;
    /**
     * The properties to pass through to the text field.
     */
    textFieldProps?: Partial<ITextFieldProps>;
    /**
     * True to use the message as a label for the text, otherwise false or undefined.
     */
    messageAsLabel?: boolean;
    /**
     * @summary Function that is called when the confirmation is acknowledged.
     * @param result Any text value provided by the userif the confirm button was clicked. False if the reject button was clicked.
     */
    onClose: (result?: string) => void;
}

/**
 * @summary A SimpleDialog wrapper that uses the specified title, message, onClose,
 * a reject button with the specified rejectButtonText or "No" if rejectButtonText is not provided,
 * and a confirm button with the specified confirmButtonText or "Yes" if confirmButtonText is not provided
 */
export class PromptDialog extends React.Component<IPromptDialogProps, any> {
    constructor(props: IPromptDialogProps) {
        super(props);
        const { messageAsLabel, textFieldProps } = this.props;
        if (messageAsLabel && textFieldProps?.label) {
            console.warn("PromptDialog: messageAsLabel will be ignored because the textFieldProps.label has a value.");
        }
    }
    /**
     * The value that to user types in.
     */
    private _value: string | undefined = '';
    /**
     * @summary Called when the confirm button is clicked.
     */
    private onConfirm = () => {
        this.props.onClose(this._value);
    };
    /**
     * @summary Called when the reject button is clicked.
     */
    private onReject = () => {
        this.props.onClose(null);
    };
    /**
     * Called when the text field value is changed.
     * @param _ The event.
     * @param newValue The new value.
     */
    private onValueChanged = (_: any, newValue?: string) => {
        this._value = newValue;
    };
    /**
     * Renders the message and a text field.
     * @returns a JSX.Element with the message and a text field to collect the user response.
     */
    private renderMessage = (): JSX.Element => {
        const { message, messageAsLabel, textFieldProps } = this.props;
        let content: JSX.Element = <>
            {message}
            <TextField {...textFieldProps} onChange={this.onValueChanged} />
        </>;
        if (messageAsLabel && !textFieldProps?.label) {
            content = <Label>
                {content}
            </Label>;
        }
        return content;
    };
    public render() {
        const { confirmButtonText, rejectButtonText, title } = this.props;
        return <SimpleDialog title={title} message={this.renderMessage()} buttons={[
            {
                text: rejectButtonText || "No",
                type: SimpleDialogButtonType.Default,
                onClick: this.onReject
            },
            {
                text: confirmButtonText || "Yes",
                type: SimpleDialogButtonType.Primary,
                onClick: this.onConfirm
            }
        ]} />
    }
}