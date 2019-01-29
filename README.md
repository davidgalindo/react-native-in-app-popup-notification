
# react-native-in-app-popup-notification

## Purpose
This React Native library allows you to create a small popup notification on top of the screen that is overlayed above all other views.
Works with both iOS and Android.

## Install
`$ npm install react-native-in-app-popup-notification --save`

## Usage
Inside a component:
```javascript
	...
	render() {
		return(
			<View style={styles.container}>
				...
				<InAppPopupNotification {...this.popupProps} ref={(popup) => this.popup = popup}/>
			</View>
		);
	}

	// Called somewhere, you choose where
	showPopup = () => {
		if (this.refs.popup) {
			this.refs.popup.displayPopup({
				title: 'Oh?',
				message: 'A wild popup appeared!',
			});
		}
	};

	popupProps = {
		// see below for provided props
		...
	};
	...
```
Make sure the InAppPopupNotification is the last component in your parent view.

## Props
Note that none of these props are required.
|Prop Name | Type | Description | Default|
|------ | ----- | ----- | ----- |
|title | String | The popup view's title. | 'Congratulations!'|
|message | String | The popup view's message. | 'You got Notified!'|
|iconPath | String | An icon present within your hybrid app's resource. See [here]:(https://facebook.github.io/react-native/docs/images#images-from-hybrid-app-s-resources) for more information. | null|
|backgroundColor | String | The content's background color. | '#FFF'|
|titleColor | String | The title's text color. | '#000'|
|titleFont | String | The title's font. | 'system font'|
|messageColor | String | The message's text color. | '#000'|
|messageFont | String | The message's font. | 'system font'|
|opacity | number | A value, 0-1 (inclusive), that controls the popup's opacity. | 1|
|height | number | The popup's height. | `getStatusBarHeight(false) + 100`|
|inOutDuration | number | The duration of the popup's appear and disappear animations, in ms. | 500|
|showDuration | number | How long the popup is showed to the user, in ms. | 5000|
|popupWasClicked | function | Executes when the popup registers a user tap. | () => { }|
|popupDidAppear | function | Executes when the popup appears on the screen and after its in animation. | () => { }|
|popupDidDisappear | function | Executes when the popup is no longer displayed on the screen. | () => { }|
|popupWillAppear | function | Executes when the popup recieves the command to appear on the screen, before the inward animation. | () => { }|
|popupWillDisappear | function | Executes when the popup recieves the command to leave the screen, after the outward animation. | () => { } |
|useNativeDriver | boolean | Whether or not to use the native driver for animations. See [here]:(https://facebook.github.io/react-native/docs/animations#using-the-native-driver) for details. | false|

## Available methods
There are three methods you can use to to control when your popup displays.

**displayPopup(parameters)** takes in a map with message and title key-value pairs. It displays the notification. Example:
```javascript
	...
	popup.displayPopup({
		title: 'A reference of some sort',
		message: '===To be continued==>',
	});
	...
```
Note that only one popup can be displayed at a time. Repeated calls are ignored, and a warning is triggered within the console.

**dismissPopup(callback)** takes in a callback function. If the popup is currently visible, it dismisses it immediately and then executes the callback when the popup has completed its outward animation. If the popup is not visible, it returns a warning. Example: 
```javascript
	...
	popup.dismissPopup(() => {
		Alert.alert('Popup is rip in kill, press F to pay resepcts');
	});
	...
```

**isVisible()** simply returns whether or not the popup is visible. Example:
```javascript
	...
	if (this.popup.isVisible()) {
		this.popup.dismissPopup();
	}
	...
```

## Libraries
This project used the following libraries. Go check them out!
[react-native-status-bar-height]:(https://github.com/ovr/react-native-status-bar-height#readme)
[react-native-timer]:(https://github.com/fractaltech/react-native-timer#readme)

## License
Licensed under the MIT license. See the License file for more information.
