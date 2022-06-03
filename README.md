# Cloudwell Simple Dialog
A Fluent UI Dialog wrapper with implementations to replace the `alert`, `confirm`, and `prompt` functions.

## How to install:
```powershell
npm i @cloudwell/simple-dialog
```

## How to use:

### JavaScript Alert to AlertDialog

This example presents the user with a JavaScript `alert` box each time the button is clicked.
```typescript
export const ShowAlertButton: React.FC<any> = () => {
  const onButtonClicked = () => {
    window.alert("Hello World!");
  }
  return <>
    <PrimaryButton onClick={onButtonClicked} >Say Hello</PrimaryButton>
  </>;
}
```

This example presents the user with a Fluent UI Dialog as an alert to be acknowledged each time the button is clicked.
```typescript
export const ShowAlertButton: React.FC<any> = () => {
  const [alertText, setAlertText] = useState<string>();
  const onButtonClicked = () => {
    setAlertText("Hello World!");
  }
  return <>
    <PrimaryButton onClick={onButtonClicked} >Say Hello</PrimaryButton>
    {alertText && <>
      <AlertDialog
        message={alertText}
        onClose={() => setAlertText(undefined)} />
    </>}
  </>;
}
```

### JavaScript Confirm to ConfirmDialog

This example presents the user with a JavaScript `confirm` box each time the button is clicked.
```typescript
export const ShowConfirmButton: React.FC<any> = () => {
  const onButtonClicked = () => {
    const result = window.confirm("Do you want to say hello?");
    console.log(`User response: ${result}`);
  }
  return <>
    <PrimaryButton onClick={onButtonClicked} >Say Hello</PrimaryButton>
  </>;
}
```

This example presents the user with Fluent UI Dialog as a confirmation box each time the button is clicked.
```typescript
export const ShowConfirmButton: React.FC<any> = () => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const onButtonClicked = () => {
    setShowConfirm(true);
  }
  const onConfirmClosed = (result: boolean) => {
    setShowConfirm(false);
    console.log(`User response: ${result}`);
  }
  return <>
    <PrimaryButton onClick={onButtonClicked} >Say Hello</PrimaryButton>
    {showConfirm && <>
      <ConfirmDialog
        message='Do you want to say hello?'
        onClose={onConfirmClosed} />
    </>}
  </>;
}
```

### JavaScript Prompt to PromptDialog

This example presents the user with a JavaScript `prompt` box each time the button is clicked.
```typescript
export const ShowPromptButton: React.FC<any> = () => {
  const onButtonClicked = () => {
    const result = window.prompt("Hi! What is your name?");
    console.log(`User response: ${result}`);
  }
  return <>
    <PrimaryButton onClick={onButtonClicked} >Say Hello</PrimaryButton>
  </>;
}
```

This example presents the user with Fluent UI Dialog as a simple text prompt each time the button is clicked.
```typescript
export const ShowPromptButton: React.FC<any> = () => {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const onButtonClicked = () => {
    setShowPrompt(true);
  }
  const onPromptClosed = (result?: string) => {
    setShowPrompt(false);
    console.log(`User response: ${result || ''}`);
  }
  return <>
    <PrimaryButton onClick={onButtonClicked} >Say Hello</PrimaryButton>
    {showPrompt && <>
      <PromptDialog
        title='Hi!'
        message='What is your name?'
        onClose={onPromptClosed} />
    </>}
  </>;
}
```

## Implementation

### ISimpleDialogProps interface
extends [`IBaseDialogProps`](#ibasedialogprops-interface)

|Name|Type|Default value|Description|
|:---|:---|:---|:---|
|**buttons**|ISimpleDialogButtonProps[]||**Required**. The buttons to show in the dialog footer.|

### IBaseDialogProps interface

|Name|Type|Default value|Description|
|:---|:---|:---|:---|
|**title**|string||The title of the dialog.|
|**message**|string \| JSX.Element||**Required**. The content to display in the body of the dialog.|
|**dialogProps**|Partial\<IDialogProps\>||The properties of the dialog to pass to the dialog.|
|**dialogContentProps**|IDialogContentProps||The properties of the dialog content to pass to the dialog.|
|**modalProps**|IModalProps||The properties of the modal to pass to the dialog.|

### ISimpleDialogButtonProps interface

|Name|Type|Default value|Description|
|:---|:---|:---|:---|
|**type**|SimpleDialogButtonType||**Required.** The type of button.|
|**text**|string||**Required.** The button text.|
|**styles**|IButtonStyles||The button styles.|
|**onClick**|CallableFunction||A function to call when the button is clicked.|
|**href**|string||The link to navigate to.|
|**target**|"_blank" \| "_self" \| "_parent" \| "_top" \| string||The frame to target.|

### SimpleDialogButtonType enum

|Name|Description|
|:---|:---|
|**Primary**|Indicates that a Fluent UI PrimaryButton will be used.|
|**Default**|Indicates that a Fluent UI DefaultButton will be used.|

### IAlertDialogProps interface
extends [`IBaseDialogProps`](#ibasedialogprops-interface)

|Name|Type|Default value|Description|
|:---|:---|:---|:---|
|**buttonText**|string|Okay|The text to show on the dialog button.|
|**onClose**|() => void||**Required.** Function that is called when the alert is acknowledged.|

### IConfirmDialogProps interface
extends [`IBaseDialogProps`](#ibasedialogprops-interface)

|Name|Type|Default value|Description|
|:---|:---|:---|:---|
|**confirmButtonText**|string|Yes|The optional text to show on the confirm dialog button.|
|**rejectButtonText**|string|No|The optional text to show on the reject dialog button.|
|**onClose**|(result: boolean) => void||**Required.** Function that is called when the confirmation is acknowledged. The result will be `true` if the confirm button was clicked or `false` if the reject button was clicked.|

### IPromptDialogProps interface
extends [`IBaseDialogProps`](#ibasedialogprops-interface)

|Name|Type|Default value|Description|
|:---|:---|:---|:---|
|**confirmButtonText**|string|Yes|The optional text to show on the confirm dialog button.|
|**rejectButtonText**|string|No|The optional text to show on the reject dialog button.|
|**textFieldProps**|Partial\<ITextFieldProps\>||The properties to pass through to the text field.|
|**messageAsLabel**|boolean||True to use the message as a label for the text, otherwise false or undefined.|
|**onClose**|(result?: string) => void||**Required.** Function that is called when the prompt is acknowledged. The result will be the user defined text if the confirm button was clicked or `undefined` if the reject button was clicked.|